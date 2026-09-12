import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Info, MapPin, Utensils, ShoppingBag, Heart, Landmark } from 'lucide-react';

export function TourismPage() {
  const sections = [
    {
      icon: MapPin,
      title: 'Getting Around',
      content: `Carrascalejo is a small, walkable town perfect for exploring on foot. The albergue is centrally located, 
      with most amenities within a 5-10 minute walk. For longer distances or trips to nearby towns, local bus services 
      are available. Taxis can be arranged through the albergue reception.`,
    },
    {
      icon: Utensils,
      title: 'Local Cuisine',
      content: `Extremadura is famous for its Iberian pork products, especially jamón and chorizo. Don't miss the local 
      cheeses, particularly Torta del Casar. Traditional dishes include migas extremeñas, caldereta de cordero, and 
      gazpacho extremeño. The region also produces excellent wines, particularly from the Ribera del Guadiana.`,
    },
    {
      icon: ShoppingBag,
      title: 'Shopping & Markets',
      content: `The weekly market takes place every Saturday morning in the Plaza Mayor. Here you'll find fresh produce, 
      local crafts, and artisan products. Several small shops in town sell pilgrim supplies, souvenirs, and traditional 
      Extremadura products. Banks and ATMs are available in the town center.`,
    },
    {
      icon: Landmark,
      title: 'Cultural Sites',
      content: `Visit the Church of San Pedro, dating back to the 16th century, with its beautiful baroque altarpiece. 
      The old town features traditional Extremadura architecture with whitewashed houses and stone details. The nearby 
      Roman bridge and ancient pathway sections offer glimpses into the region's long history.`,
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      content: `The local health center (Centro de Salud) is located on Calle de la Salud, open Monday-Friday 9am-9pm. 
      For emergencies, call 112. Pharmacies are available in the town center. Several massage therapists and 
      physiotherapists in town offer services for pilgrims with tired muscles.`,
    },
    {
      icon: Info,
      title: 'Practical Information',
      content: `WiFi is available at the albergue and most cafés. Spanish and some English are spoken in tourist areas. 
      The local tourist office on Plaza Mayor can provide maps and information. Laundry services are available at the 
      albergue and in town. Post office hours are Monday-Friday 9am-2pm, Saturday 9:30am-1pm.`,
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
            <h1 className="mb-4">Tourism Information</h1>
            <p className="text-gray-600">
              Everything you need to know about Carrascalejo and the surrounding area
            </p>
          </div>

          {/* Hero Image */}
          <Card className="mb-12 overflow-hidden">
            <div className="h-[400px] relative">
              <img
                src="https://images.unsplash.com/photo-1601210026600-6673ca8d0a40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHRyZW1hZHVyYSUyMHNwYWluJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc2NjEzMTM4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Extremadura landscape"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h2 className="text-white mb-2">Welcome to Extremadura</h2>
                  <p className="text-white/90">
                    A region of rich history, stunning landscapes, and warm hospitality
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Information Accordion */}
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {sections.map((section, index) => (
                  <AccordionItem key={section.title} value={`item-${index}`}>
                    <AccordionTrigger className="hover:text-[#00AB39]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <section.icon className="w-5 h-5 text-[#00AB39]" />
                        </div>
                        <span>{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-13 pt-2 text-gray-600">
                        {section.content}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Facts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="text-center">
                <CardContent className="p-6">
                  <h3 className="mb-2">Population</h3>
                  <p className="text-3xl text-[#00AB39] mb-2">~1,200</p>
                  <p className="text-sm text-gray-600">Residents</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="text-center">
                <CardContent className="p-6">
                  <h3 className="mb-2">Elevation</h3>
                  <p className="text-3xl text-[#00AB39] mb-2">412m</p>
                  <p className="text-sm text-gray-600">Above sea level</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="text-center">
                <CardContent className="p-6">
                  <h3 className="mb-2">Climate</h3>
                  <p className="text-3xl text-[#00AB39] mb-2">Mediterranean</p>
                  <p className="text-sm text-gray-600">Hot summers, mild winters</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contact Info */}
          <Card className="mt-12 bg-[#00AB39] text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-white mb-4">Need More Information?</h3>
              <p className="mb-6 text-white/90">
                Visit the local tourist office or contact our albergue staff for personalized recommendations
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <div className="text-sm">
                  <p className="text-white/80">Tourist Office</p>
                  <p>+34 123 456 789</p>
                </div>
                <div className="text-sm">
                  <p className="text-white/80">Albergue Reception</p>
                  <p>+34 987 654 321</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
