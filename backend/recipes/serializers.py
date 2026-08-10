from rest_framework import serializers
from .models import SavedRecipe


class SavedRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedRecipe       # tells DRF which model this serializer is based on
        fields = "__all__"        # include every field from the SavedRecipe model