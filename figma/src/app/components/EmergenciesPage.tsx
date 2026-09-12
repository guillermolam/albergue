import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Phone, AlertCircle, MapPin, Clock, Hospital, Shield } from 'lucide-react';

export function EmergenciesPage() {
  const emergencyContacts = [
    {
      icon: AlertCircle,
      title: 'General Emergency',
      number: '112',
      description: 'All emergencies (Police, Fire, Medical)',
      available: '24/7',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-[#ED1C24]',
    },
    {
      icon: Hospital,
      title: 'Medical Emergency',
      number: '061',
      description: 'Ambulance and urgent medical assistance',
      available: '24/7',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-[#ED1C24]',
    },
    {
      icon: Shield,
      title: 'Local Police',
      number: '+34 924 XXX XXX',
      description: 'Carrascalejo Municipal Police',
      available: '24/7',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-[#0071BC]',
    },
    {
      icon: Hospital,
      title: 'Health Center',
      number: '+34 924 XXX XXX',
      description: 'Centro de Salud Carrascalejo',
      available: 'Mon-Fri: 9am-9pm',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-[#00AB39]',
    },
    {
      icon: Phone,
      title: 'Pharmacy',
      number: '+34 924 XXX XXX',
      description: 'Farmacia Central',
      available: 'Mon-Sat: 9am-10pm',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-[#00AB39]',
    },
    {
      icon: MapPin,
      title: 'Albergue Reception',
      number: '+34 987 654 321',
      description: 'For albergue-related assistance',
      available: '8am-10pm',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-[#00AB39]',
    },
  ];

  const importantLocations = [
    {
      name: 'Hospital Regional',
      address: 'Calle Hospital, 15, Cáceres',
      distance: '45 km',
      description: 'Nearest major hospital with full emergency services',
    },
    {
      name: 'Centro de Salud',
      address: 'Calle de la Salud, 8, Carrascalejo',
      distance: '0.5 km',
      description: 'Local health center for non-emergency medical care',
    },
    {
      name: 'Farmacia Central',
      address: 'Plaza Mayor, 3, Carrascalejo',
      distance: '0.3 km',
      description: 'Main pharmacy in town center',
    },
    {
      name: 'Police Station',
      address: 'Calle Policía, 12, Carrascalejo',
      distance: '0.4 km',
      description: 'Local police headquarters',
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
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-[#ED1C24]" />
              </div>
            </div>
            <h1 className="mb-4">Emergency Contacts</h1>
            <p className="text-gray-600">
              Important numbers and locations for your safety
            </p>
          </div>

          {/* Critical Emergency Banner */}
          <Card className="mb-12 bg-red-50 border-red-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-[#ED1C24] mb-4">In Case of Emergency</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div>
                  <p className="text-sm text-gray-600 mb-2">General Emergency</p>
                  <a href="tel:112" className="text-5xl text-[#ED1C24] hover:underline">
                    112
                  </a>
                </div>
                <div className="hidden md:block w-px h-16 bg-red-200" />
                <div>
                  <p className="text-sm text-gray-600 mb-2">Medical Emergency</p>
                  <a href="tel:061" className="text-5xl text-[#ED1C24] hover:underline">
                    061
                  </a>
                </div>
              </div>
              <p className="mt-6 text-sm text-gray-600">
                Available 24/7 • Operators speak English and Spanish
              </p>
            </CardContent>
          </Card>

          {/* Emergency Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className={`h-full border-2 ${contact.color}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <contact.icon className={`w-6 h-6 ${contact.iconColor}`} />
                      </div>
                      <CardTitle className="text-lg">{contact.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <a 
                      href={`tel:${contact.number.replace(/\s/g, '')}`}
                      className={`text-2xl block hover:underline ${contact.iconColor}`}
                    >
                      {contact.number}
                    </a>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{contact.available}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Important Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#00AB39]" />
                Important Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {importantLocations.map((location, index) => (
                  <motion.div
                    key={location.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border-b last:border-b-0 pb-4 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4>{location.name}</h4>
                      <span className="text-sm text-[#00AB39]">{location.distance}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{location.address}</p>
                    <p className="text-sm text-gray-500">{location.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card className="mt-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#0071BC]" />
                Safety Tips for Pilgrims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#0071BC] mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    Always carry your Pilgrim Credential, ID, and emergency contacts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0071BC] mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    Keep a charged mobile phone with you at all times
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0071BC] mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    Inform albergue staff of your planned route and expected arrival at next stop
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0071BC] mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    Stay hydrated and take breaks, especially during hot summer months
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0071BC] mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    If you feel unwell, seek medical attention immediately - don't continue walking
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
