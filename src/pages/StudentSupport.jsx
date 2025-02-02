import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CreditCard, Globe, MapPin, Copy, Mail } from 'lucide-react';

const BankingDetailsPage = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Nelson Mandela University</h1>
          <p className="text-gray-600">Banking & Payment Details</p>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-800 mb-2">Please send proof of payment to both email addresses:</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white p-3 rounded">
                  <span className="font-medium">intfees@mandela.ac.za</span>
                  <button onClick={() => copyToClipboard("intfees@mandela.ac.za")} className="text-indigo-600 hover:text-indigo-700">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between bg-white p-3 rounded">
                  <span className="font-medium">tkmudzingwa@gmail.com</span>
                  <button onClick={() => copyToClipboard("tkmudzingwa@gmail.com")} className="text-indigo-600 hover:text-indigo-700">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* International Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              International Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Name</p>
                <p className="font-medium flex items-center justify-between">
                  Nelson Mandela University – Main
                  <button onClick={() => copyToClipboard("Nelson Mandela University – Main")} className="text-blue-600 hover:text-blue-700">
                    <Copy className="h-4 w-4" />
                  </button>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Number</p>
                <p className="font-medium flex items-center justify-between">
                  080263011
                  <button onClick={() => copyToClipboard("080263011")} className="text-blue-600 hover:text-blue-700">
                    <Copy className="h-4 w-4" />
                  </button>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Bank Swift Code</p>
                <p className="font-medium flex items-center justify-between">
                  SBZA ZAJJ
                  <button onClick={() => copyToClipboard("SBZA ZAJJ")} className="text-blue-600 hover:text-blue-700">
                    <Copy className="h-4 w-4" />
                  </button>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Internet Banking Code</p>
                <p className="font-medium flex items-center justify-between">
                  051001
                  <button onClick={() => copyToClipboard("051001")} className="text-blue-600 hover:text-blue-700">
                    <Copy className="h-4 w-4" />
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Local Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Local Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Name</p>
                <p className="font-medium flex items-center justify-between">
                  Nelson Mandela University – Main
                  <button onClick={() => copyToClipboard("Nelson Mandela University – Main")} className="text-blue-600 hover:text-blue-700">
                    <Copy className="h-4 w-4" />
                  </button>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Number</p>
                <p className="font-medium flex items-center justify-between">
                  080265855
                  <button onClick={() => copyToClipboard("080265855")} className="text-blue-600 hover:text-blue-700">
                    <Copy className="h-4 w-4" />
                  </button>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Internet Banking Code</p>
                <p className="font-medium flex items-center justify-between">
                  050417
                  <button onClick={() => copyToClipboard("050417")} className="text-blue-600 hover:text-blue-700">
                    <Copy className="h-4 w-4" />
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bank Name & Address</p>
              <p className="font-medium">Standard Bank</p>
              <p className="text-gray-600">Rink Street, Port Elizabeth, South Africa</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Reference</p>
              <p className="font-medium">Student Number</p>
            </div>
          </CardContent>
        </Card>

        {/* Online Payments */}
       
      </div>
    </div>
  );
};

export default BankingDetailsPage;