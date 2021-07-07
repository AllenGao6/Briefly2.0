from rest_framework import permissions

class CollectionUserPermission(permissions.BasePermission):
    message = "The collection is avaliable for the owner only."
       
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
    
class VideoUserPermission(permissions.BasePermission):
    message = "The video is avaliable for the owner only."
    
    def has_object_permission(self, request, view, obj):
        print(f'power: {obj.collection.owner == request.user}')
        return obj.collection.owner == request.user
    


class AudioUserPermission(permissions.BasePermission):
    message = "The Audio is avaliable for the owner only."
    
    def has_object_permission(self, request, view, obj):
        return obj.collection.owner == request.user