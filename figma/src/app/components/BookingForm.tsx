import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { CreditCard, Wallet, Building2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';
import { WiredButton } from './doodle/WiredButton';
import { DoodleCard } from './doodle/DoodleCard';
import { IDUpload } from './doodle/IDUpload';

interface BookingFormProps {
  selectedBeds: string[];
  checkInDate: Date | undefined;
}

export function BookingForm({ selectedBeds, checkInDate }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 7;

  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    // Step 2: Contact Details
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    // Step 3: Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    // Step 4: Pilgrim Credential
    credentialNumber: '',
    startLocation: '',
    // Step 5: ID Upload
    idType: '',
    idNumber: '',
    idFile: null as File | null,
    // Step 6: Payment Method
    paymentMethod: '',
    // Step 7: Special Requests
    specialRequests: '',
  });

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateFormData('idFile', file);
      
      // Simulate OCR extraction
      setTimeout(() => {
        updateFormData('idNumber', 'ABC123456');
        updateFormData('firstName', 'John');
        updateFormData('lastName', 'Doe');
        toast.success('ID information extracted successfully');
      }, 1000);
    }
  };

  const handleSubmit = () => {
    toast.success('Booking confirmed! Check your email for details.');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  const steps = [
    'Personal Info',
    'Contact',
    'Emergency',
    'Credential',
    'ID Upload',
    'Payment',
    'Review',
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Stepper */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="mb-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex flex-col items-center flex-1 ${
                  index + 1 === currentStep
                    ? 'text-[#00AB39]'
                    : index + 1 < currentStep
                    ? 'text-[#00AB39]'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index + 1 === currentStep
                      ? 'bg-[#00AB39] text-white'
                      : index + 1 < currentStep
                      ? 'bg-[#00AB39] text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {index + 1 < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <span className="text-xs hidden md:block text-center">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && 'Personal Information'}
                {currentStep === 2 && 'Contact Details'}
                {currentStep === 3 && 'Emergency Contact'}
                {currentStep === 4 && 'Pilgrim Credential'}
                {currentStep === 5 && 'ID Verification'}
                {currentStep === 6 && 'Payment Method'}
                {currentStep === 7 && 'Review & Confirm'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Select
                        value={formData.nationality}
                        onValueChange={(value) => updateFormData('nationality', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ES">Spain</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="IT">Italy</SelectItem>
                          <SelectItem value="PT">Portugal</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="+34 123 456 789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        placeholder="Madrid"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => updateFormData('country', e.target.value)}
                        placeholder="Spain"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Emergency Contact */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyName}
                      onChange={(e) => updateFormData('emergencyName', e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => updateFormData('emergencyPhone', e.target.value)}
                      placeholder="+34 987 654 321"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyRelation">Relationship</Label>
                    <Select
                      value={formData.emergencyRelation}
                      onValueChange={(value) => updateFormData('emergencyRelation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 4: Pilgrim Credential */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="credentialNumber">Pilgrim Credential Number</Label>
                    <Input
                      id="credentialNumber"
                      value={formData.credentialNumber}
                      onChange={(e) => updateFormData('credentialNumber', e.target.value)}
                      placeholder="PC123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startLocation">Starting Location</Label>
                    <Input
                      id="startLocation"
                      value={formData.startLocation}
                      onChange={(e) => updateFormData('startLocation', e.target.value)}
                      placeholder="e.g., Saint-Jean-Pied-de-Port"
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> A valid Pilgrim Credential is required to stay at our
                      albergue. If you don't have one yet, you can obtain it at various starting
                      points along the Camino.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: ID Upload */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="idType">ID Type</Label>
                    <Select
                      value={formData.idType}
                      onValueChange={(value) => updateFormData('idType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="national-id">National ID Card / DNI</SelectItem>
                        <SelectItem value="drivers-license">Driver's License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <IDUpload
                    onUpload={(file) => {
                      updateFormData('idFile', file);
                      // Simulate OCR extraction
                      setTimeout(() => {
                        updateFormData('idNumber', '51503381X');
                        updateFormData('firstName', 'Xeciva');
                        updateFormData('lastName', 'Alana');
                        updateFormData('dateOfBirth', '2007-10-07');
                        toast.success('ID information extracted successfully!');
                      }, 2000);
                    }}
                    label="Upload Your ID / DNI / Passport"
                  />
                  
                  {formData.idFile && (
                    <div className="mt-4 p-4 bg-green-50 border-2 border-[#00AB39] rounded-lg doodle-border">
                      <p className="text-sm text-[#00AB39] font-medium mb-2">✓ Extracted Information:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        <span className="font-medium">Name:</span>
                        <span>{formData.firstName} {formData.lastName}</span>
                        <span className="font-medium">ID Number:</span>
                        <span>{formData.idNumber}</span>
                        <span className="font-medium">Date of Birth:</span>
                        <span>{formData.dateOfBirth}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 6: Payment Method */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div>
                    <Label>Select Payment Method</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <button
                        onClick={() => updateFormData('paymentMethod', 'card')}
                        className={`p-6 border-2 rounded-lg flex flex-col items-center gap-3 transition-all ${
                          formData.paymentMethod === 'card'
                            ? 'border-[#00AB39] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className="w-8 h-8" />
                        <span>Credit Card</span>
                      </button>
                      <button
                        onClick={() => updateFormData('paymentMethod', 'cash')}
                        className={`p-6 border-2 rounded-lg flex flex-col items-center gap-3 transition-all ${
                          formData.paymentMethod === 'cash'
                            ? 'border-[#00AB39] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Wallet className="w-8 h-8" />
                        <span>Pay on Arrival</span>
                      </button>
                      <button
                        onClick={() => updateFormData('paymentMethod', 'transfer')}
                        className={`p-6 border-2 rounded-lg flex flex-col items-center gap-3 transition-all ${
                          formData.paymentMethod === 'transfer'
                            ? 'border-[#00AB39] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Building2 className="w-8 h-8" />
                        <span>Bank Transfer</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => updateFormData('specialRequests', e.target.value)}
                      placeholder="Any dietary restrictions, accessibility needs, or other requests..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 7: Review & Confirm */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div>
                      <h4 className="mb-2">Booking Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-600">Selected Beds:</span>
                        <span>{selectedBeds.join(', ')}</span>
                        <span className="text-gray-600">Check-in Date:</span>
                        <span>
                          {checkInDate ? checkInDate.toLocaleDateString() : 'Not selected'}
                        </span>
                        <span className="text-gray-600">Number of Beds:</span>
                        <span>{selectedBeds.length}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="mb-2">Personal Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-600">Name:</span>
                        <span>
                          {formData.firstName} {formData.lastName}
                        </span>
                        <span className="text-gray-600">Email:</span>
                        <span>{formData.email}</span>
                        <span className="text-gray-600">Phone:</span>
                        <span>{formData.phone}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="mb-2">Payment</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-600">Method:</span>
                        <span className="capitalize">{formData.paymentMethod}</span>
                        <span className="text-gray-600">Total:</span>
                        <span>€{selectedBeds.length * 10}.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      By confirming this booking, you agree to the albergue's terms and conditions.
                      You will receive a confirmation email with all booking details.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                {currentStep > 1 && (
                  <WiredButton variant="outline" onClick={handleBack} className="flex-1">
                    Back
                  </WiredButton>
                )}
                {currentStep < totalSteps && (
                  <WiredButton onClick={handleNext} className="flex-1 bg-[#00AB39] hover:bg-[#008c2f]">
                    Continue
                  </WiredButton>
                )}
                {currentStep === totalSteps && (
                  <WiredButton
                    onClick={handleSubmit}
                    className="flex-1 bg-[#00AB39] hover:bg-[#008c2f]"
                  >
                    Confirm Booking
                  </WiredButton>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}