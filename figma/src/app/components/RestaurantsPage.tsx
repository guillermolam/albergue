import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MapPin, Euro, Utensils } from "lucide-react";

export function RestaurantsPage() {
  const restaurants = [
    {
      name: "Restaurante El Camino",
      type: "Traditional Spanish",
      distance: "0.2 km",
      priceRange: "€€",
      description:
        "Family-run restaurant serving authentic Extremadura cuisine",
      specialties: "Iberian pork, local cheese, traditional stews",
      image:
        "https://images.unsplash.com/photo-1710886480727-cd0a013fd6e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFuaXNoJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2NjEzMTM4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      name: "Bar Los Peregrinos",
      type: "Tapas & Bar",
      distance: "0.1 km",
      priceRange: "€",
      description: "Popular pilgrim hangout with affordable tapas and drinks",
      specialties: "Tapas, bocadillos, pilgrim menu",
      image:
        "https://images.unsplash.com/photo-1710886480727-cd0a013fd6e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFuaXNoJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2NjEzMTM4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      name: "Mesón La Encina",
      type: "Regional Cuisine",
      distance: "0.3 km",
      priceRange: "€€€",
      description:
        "Upscale dining featuring local wines and seasonal ingredients",
      specialties: "Game meats, regional wines, seasonal vegetables",
      image:
        "https://images.unsplash.com/photo-1710886480727-cd0a013fd6e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFuaXNoJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2NjEzMTM4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      name: "Cafetería Plaza",
      type: "Café & Bakery",
      distance: "0.15 km",
      priceRange: "€",
      description:
        "Perfect for breakfast before starting your day on the Camino",
      specialties: "Fresh pastries, coffee, breakfast",
      image:
        "https://images.unsplash.com/photo-1710886480727-cd0a013fd6e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFuaXNoJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2NjEzMTM4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="mb-4">Local Restaurants</h1>
            <p className="text-gray-600">
              Discover the best dining options near the albergue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{restaurant.name}</span>
                      <span className="text-[#00AB39] text-sm">
                        {restaurant.priceRange}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Utensils className="w-4 h-4" />
                      <span>{restaurant.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.distance} from albergue</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {restaurant.description}
                    </p>
                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <span className="text-gray-600">Specialties:</span>{" "}
                        <span className="text-[#00AB39]">
                          {restaurant.specialties}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
