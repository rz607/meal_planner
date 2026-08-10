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