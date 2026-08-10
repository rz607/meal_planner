from django.urls import path
from . import views


#map ping/ path to ping view
urlpatterns = [
    path('ping/', views.ping),
    path('search/', views.search_recipes),
    path('favorites/', views.favorites_list),
    path('favorites/<int:pk>/', views.favorites_delete),

]