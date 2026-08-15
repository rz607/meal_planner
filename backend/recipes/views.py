from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

from .models import SavedRecipe
from .serializers import SavedRecipeSerializer

#return ok status
def ping(request):
    return JsonResponse({"status": "ok"})

@api_view(["GET"]) #only allow GET requests to endpoint
def search_recipes(request):
    query = request.GET.get("q", "")   # reads ?q=something from the URL
    response = requests.get(f"https://www.themealdb.com/api/json/v1/1/search.php?s={query}")
    data = response.json()
    meals = data.get("meals") or []    # TheMealDB returns None if there are no results

    # Clean up  messy response into just whats needed
    results = [
        {"id": meal["idMeal"], "name": meal["strMeal"], "image": meal["strMealThumb"]}
        for meal in meals
    ]
    return Response(results)


# --- FAVORITES ---
# GET: list all saved recipes
# POST: save a new one
@api_view(["GET", "POST"])
def favorites_list(request):
    if request.method == "GET":
        favorites = SavedRecipe.objects.all()
        serializer = SavedRecipeSerializer(favorites, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        meal_id = request.data.get("meal_id")
        if SavedRecipe.objects.filter(meal_id=meal_id).exists():
            return Response({"error": "Recipe already saved"}, status=400)
        serializer = SavedRecipeSerializer(data=request.data)
        if serializer.is_valid():#check data matches model expectations
            serializer.save()
            return Response(serializer.data, status=201)#success
        return Response(serializer.errors, status=400)#failure


# DELETE: remove a saved recipe by its database id
@api_view(["DELETE"])
def favorites_delete(request, pk):
    try:
        recipe = SavedRecipe.objects.get(pk=pk)
        recipe.delete()
        return Response(status=204)#success
    except SavedRecipe.DoesNotExist:
        return Response(status=404)#failure

# Fetches full details for one recipe, 
@api_view(["GET"])
def recipe_detail(request, meal_id):
    response = requests.get(f"https://www.themealdb.com/api/json/v1/1/lookup.php?i={meal_id}")
    data = response.json()
    meals = data.get("meals") or []

    if not meals:
        return Response({"error": "Recipe not found"}, status=404)

    meal = meals[0]   # lookup returns a list with exactly one item

    # TheMealDB spreads ingredients across strIngredient1..20 and strMeasure1..20
    # loop collects them into a clean list, skipping empty slots
    ingredients = []
    for i in range(1, 21):
        ingredient = meal.get(f"strIngredient{i}")
        measure = meal.get(f"strMeasure{i}")
        if ingredient and ingredient.strip():
            ingredients.append({
                "name": ingredient.strip(),
                "measure": measure.strip() if measure else ""
            })

    result = {
        "id": meal["idMeal"],
        "name": meal["strMeal"],
        "image": meal["strMealThumb"],
        "instructions": meal["strInstructions"],
        "ingredients": ingredients
    }
    return Response(result)