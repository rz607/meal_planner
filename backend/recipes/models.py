from django.db import models

#SavedREcipe model
class SavedRecipe(models.Model):
    meal_id = models.CharField(max_length=50)        # ID  recipe
    name = models.CharField(max_length=200)           # recipe name
    image = models.URLField()                          # link to the recipe's image
    ingredients = models.JSONField()                   # stores a list of ingredients as JSON

#show name of object
    def __str__(self):
        return self.name