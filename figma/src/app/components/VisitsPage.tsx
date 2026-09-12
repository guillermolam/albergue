import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Clock, MapPin, Users, Euro } from 'lucide-react';

export function VisitsPage() {
  const freeTours = [
    {
      name: 'Historic Town Center Walk',
      duration: '1-2 hours',
      distance: 'Self-guided',
      description: 'Explore the charming streets and historic buildings of Carrascalejo at your own pace',
      highlights: ['Plaza Mayor', 'Church of San Pedro', 'Traditional architecture', 'Local artisan shops'],
    },
    {
      name: 'Camino Trail Extension',
      duration: '2-3 hours',
      distance: '5 km loop',
      description: 'A beautiful circular walk that takes you through the countryside surrounding the town',
      highlights: ['Olive groves', 'Panoramic views', 'Wildlife spotting', 'Photo opportunities'],
    },
    {
      name: 'Sunset Viewpoint',
      duration: '30 minutes',
      distance: '1 km',
      description: 'Short walk to the best sunset viewing spot in the area',
      highlights: ['360° views', 'Perfect for reflection', 'Photography', 'Evening meditation'],
    },
  ];

  const guidedTours = [
    {
      name: 'Extremadura Heritage Tour',
      duration: '4 hours',
      price: '€25 per person',
      groupSize: 'Min. 4 people',
      description: 'Comprehensive tour of the region\'s historical and cultural sites with a local expert',
      highlights: ['Roman ruins', 'Medieval castle', 'Local winery visit', 'Traditional lunch included'],
    },
    {
      name: 'Camino History Experience',
      duration: '3 hours',
      price: '€20 per person',
      groupSize: 'Min. 6 people',
      description: 'Deep dive into the history and significance of the Camino de Santiago in this region',
      highlights: ['Pilgrim traditions', 'Historical sites', 'Spiritual significance', 'Q&A with guide'],
    },
    {
      name: 'Nature & Wildlife Trek',
      duration: '5 hours',
      price: '€35 per person',
      groupSize: 'Min. 4 people',
      description: 'Guided nature walk through Extremadura\'s unique ecosystem',
      highlights: ['Bird watching', 'Native flora', 'Geological features', 'Picnic lunch'],
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
            <h1 className="mb-4">Tours & Visits</h1>
            <p className="text-gray-600">
              Explore the beauty and history of Carrascalejo and its surroundings
            </p>
          </div>

          <Tabs defaultValue="free" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="free">Free Tours</TabsTrigger>
              <TabsTrigger value="guided">Guided Tours</TabsTrigger>
            </TabsList>

            <TabsContent value="free">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freeTours.map((tour, index) => (
                  <motion.div
                    key={tour.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <CardTitle>{tour.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{tour.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{tour.distance}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{tour.description}</p>
                        <div className="pt-3 border-t">
                          <p className="text-sm mb-2">Highlights:</p>
                          <ul className="space-y-1">
                            {tour.highlights.map((highlight) => (
                              <li key={highlight} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-[#00AB39] mt-1">•</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="guided">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guidedTours.map((tour, index) => (
                  <motion.div
                    key={tour.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow border-[#00AB39]/20">
                      <CardHeader>
                        <CardTitle>{tour.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{tour.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Euro className="w-4 h-4" />
                            <span className="text-[#00AB39]">{tour.price}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{tour.groupSize}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{tour.description}</p>
                        <div className="pt-3 border-t">
                          <p className="text-sm mb-2">Highlights:</p>
                          <ul className="space-y-1">
                            {tour.highlights.map((highlight) => (
                              <li key={highlight} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-[#00AB39] mt-1">•</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button className="w-full mt-4 bg-[#00AB39] text-white py-2 rounded-lg hover:bg-[#008c2f] transition-colors">
                          Book Tour
                        </button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <p className="text-sm text-blue-900">
                      <strong>Booking Information:</strong> Guided tours must be booked at least 48 hours in advance. 
                      Contact the albergue reception or call +34 123 456 789 to arrange your tour.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
