import { useState } from "react";
import { User, Mail, Phone, CreditCard, Calendar, Globe } from "lucide-react";
import { Button } from "../../Button";

/**
 * PersonalDetailsStep - Step 1: Collect personal information
 */
export function PersonalDetailsStep({ initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    emiratesId: initialData?.emiratesId || "",
    dateOfBirth: initialData?.dateOfBirth || "",
    nationality: initialData?.nationality || "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.fullName && formData.email && formData.phone && formData.emiratesId;

  return (
    <div className="flex flex-col h-full">
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Personal Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Please provide your personal details</p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-gray-600 dark:text-gray-400 mb-2">
              FULL NAME *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full h-12 pl-12 pr-4 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500/20 transition-all placeholder:text-gray-400"
                placeholder="As per Emirates ID"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-gray-600 dark:text-gray-400 mb-2">
              EMAIL ADDRESS *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full h-12 pl-12 pr-4 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500/20 transition-all placeholder:text-gray-400"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-gray-600 dark:text-gray-400 mb-2">
              MOBILE NUMBER *
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full h-12 pl-12 pr-4 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500/20 transition-all placeholder:text-gray-400"
                placeholder="+971 50 000 0000"
              />
            </div>
          </div>

          {/* Emirates ID */}
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-gray-600 dark:text-gray-400 mb-2">
              EMIRATES ID *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.emiratesId}
                onChange={(e) => handleInputChange("emiratesId", e.target.value)}
                className="w-full h-12 pl-12 pr-4 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500/20 transition-all placeholder:text-gray-400"
                placeholder="784-XXXX-XXXXXXX-X"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-gray-600 dark:text-gray-400 mb-2">
              DATE OF BIRTH
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="w-full h-12 pl-12 pr-4 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500/20 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-gray-600 dark:text-gray-400 mb-2">
              NATIONALITY
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formData.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
                className="w-full h-12 pl-12 pr-4 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500/20 transition-all appearance-none"
              >
                <option value="">Select nationality</option>
                <option value="UAE">UAE</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="India">India</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Philippines">Philippines</option>
                <option value="Egypt">Egypt</option>
                <option value="Jordan">Jordan</option>
                <option value="Lebanon">Lebanon</option>
                <option value="UK">United Kingdom</option>
                <option value="USA">United States</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Footer - Continue Button */}
      <div className="px-6 py-5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} disabled={!isFormValid}>
          Continue
        </Button>
      </div>
    </div>
  );
}

export default PersonalDetailsStep;
