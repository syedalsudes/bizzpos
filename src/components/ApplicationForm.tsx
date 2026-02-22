'use client';

import { useState } from 'react';
import {
  Upload, X, AlertCircle, CheckCircle, Loader,
  Building2, User, FileText, ShieldCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Interfaces and Types (Exactly as provided)
interface FormState {
  dbaName: string;
  businessPhone: string;
  businessWebsite: string;
  businessAddress: string;
  shippingAddress: string;
  taxId: string;
  ownerFirstName: string;
  ownerLastName: string;
  personalPhone: string;
  email: string;
  ssn: string;
}

interface UploadedFiles {
  driversLicense: File | null;
  businessLicense: File | null;
  voidCheck: File | null;
  additionalDocument: File | null;
}

interface ApplicationFormProps {
  onSubmit: (formData: any, files: UploadedFiles) => void | Promise<void>;
  loading?: boolean;
}

export function ApplicationForm({ onSubmit }: ApplicationFormProps) {
  const [step, setStep] = useState(1);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<FormState>({
    dbaName: '',
    businessPhone: '',
    businessWebsite: '',
    businessAddress: '',
    shippingAddress: '',
    taxId: '',
    ownerFirstName: '',
    ownerLastName: '',
    personalPhone: '',
    email: '',
    ssn: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    driversLicense: null,
    businessLicense: null,
    voidCheck: null,
    additionalDocument: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (field: keyof UploadedFiles, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [field]: file }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.dbaName) newErrors.dbaName = 'Required';
      if (!formData.businessPhone) newErrors.businessPhone = 'Required';
      if (!formData.businessAddress) newErrors.businessAddress = 'Required';
      if (!formData.taxId) newErrors.taxId = 'Required';
    } else if (step === 2) {
      if (!formData.ownerFirstName) newErrors.ownerFirstName = 'Required';
      if (!formData.ownerLastName) newErrors.ownerLastName = 'Required';
      if (!formData.email) newErrors.email = 'Required';
      if (!formData.ssn) newErrors.ssn = 'Required';
    } else if (step === 3) {
      if (!uploadedFiles.driversLicense) newErrors.driversLicense = 'Required';
      if (!uploadedFiles.businessLicense) newErrors.businessLicense = 'Required';
      if (!uploadedFiles.voidCheck) newErrors.voidCheck = 'Required';
    } else if (step === 4 && !agree) {
      newErrors.agree = 'Acceptance is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const mappedData = {
        dba_name: formData.dbaName,
        business_phone: formData.businessPhone,
        business_website: formData.businessWebsite,
        business_address: formData.businessAddress,
        shipping_address: formData.shippingAddress,
        tax_id: formData.taxId,
        owner_first_name: formData.ownerFirstName,
        owner_last_name: formData.ownerLastName,
        personal_phone: formData.personalPhone,
        email: formData.email,
        ssn: formData.ssn,
      };

      if (onSubmit) {
        await onSubmit(mappedData, uploadedFiles);
      } else {
        await handleSubmit();
      }
    } catch (err: any) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in first');

      const uploadFile = async (file: File, folder: string) => {
        const filePath = `${user.id}/${folder}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from('submissions').upload(filePath, file);
        if (error) throw new Error(error.message);
        const { data } = supabase.storage.from('submissions').getPublicUrl(filePath);
        return data.publicUrl;
      };

      const urls = await Promise.all([
        uploadFile(uploadedFiles.driversLicense!, 'drivers_license'),
        uploadFile(uploadedFiles.businessLicense!, 'business_license'),
        uploadFile(uploadedFiles.voidCheck!, 'void_check'),
        uploadedFiles.additionalDocument ? uploadFile(uploadedFiles.additionalDocument, 'additional') : null,
      ]);

      const { error } = await supabase.from('applications').insert({
        user_id: user.id,
        dba_name: formData.dbaName,
        business_phone: formData.businessPhone,
        business_website: formData.businessWebsite,
        business_address: formData.businessAddress,
        shipping_address: formData.shippingAddress,
        tax_id: formData.taxId,
        owner_first_name: formData.ownerFirstName,
        owner_last_name: formData.ownerLastName,
        personal_phone: formData.personalPhone,
        email: formData.email,
        ssn: formData.ssn,
        drivers_license_url: urls[0],
        business_license_url: urls[1],
        void_check_url: urls[2],
        additional_doc_url: urls[3],
        status: 'pending',
      });

      if (error) throw error;
      router.push('/dashboard?success=true');
    } catch (err: any) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-stone-900 mb-2 tracking-tighter uppercase">Merchant Application</h1>
        <p className="text-stone-500 font-medium italic">Please provide accurate details to expedite your approval.</p>
      </div>

      {/* Stepper Implementation */}
      <div className="flex items-center justify-between mb-12 relative px-4">
        {[{ id: 1, label: 'Business', icon: Building2 },
          { id: 2, label: 'Personal', icon: User },
          { id: 3, label: 'Documents', icon: FileText },
          { id: 4, label: 'Finalize', icon: ShieldCheck }].map((s) => (
          <div key={s.id} className="flex flex-col items-center z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
              step >= s.id 
                ? 'bg-[#8B3DA5] text-white shadow-xl shadow-[#8B3DA5]/20' 
                : 'bg-white border-2 border-stone-100 text-stone-300'
            }`}>
              <s.icon size={20} />
            </div>
            <span className={`mt-2 text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-[#8B3DA5]' : 'text-stone-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
        <div className="absolute top-6 left-0 w-full h-[2px] bg-stone-100 -z-0" />
        <div 
          className="absolute top-6 left-0 h-[2px] bg-[#8B3DA5] transition-all duration-700 -z-0" 
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-[#8B3DA5]/5 border border-stone-100 p-8 md:p-10 relative overflow-hidden">
        {/* Subtle Decorative Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#8B3DA5]/20 to-transparent" />

        {errors.form && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 flex items-center gap-3 rounded-r-xl">
            <AlertCircle size={20} /> <p className="text-sm font-bold">{errors.form}</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="Business Details" description="Tell us about your company" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="DBA / Business Name" name="dbaName" value={formData.dbaName} onChange={handleInputChange} error={errors.dbaName} placeholder="Marketing Name" />
              <InputField label="Business Phone" name="businessPhone" value={formData.businessPhone} onChange={handleInputChange} error={errors.businessPhone} placeholder="(555) 000-0000" />
              <div className="md:col-span-2">
                <InputField label="Business Website" name="businessWebsite" value={formData.businessWebsite} onChange={handleInputChange} placeholder="https://www.example.com" />
              </div>
              <InputField label="Business Address" name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} error={errors.businessAddress} placeholder="Physical Location" />
              <InputField label="Shipping Address" name="shippingAddress" value={formData.shippingAddress} onChange={handleInputChange} placeholder="Where to send equipment" />
              <div className="md:col-span-2">
                <InputField label="TIN / EIN (Tax ID)" name="taxId" value={formData.taxId} onChange={handleInputChange} error={errors.taxId} placeholder="XX-XXXXXXX" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="Personal Details" description="Authorized owner information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="First Name" name="ownerFirstName" value={formData.ownerFirstName} onChange={handleInputChange} error={errors.ownerFirstName} />
              <InputField label="Last Name" name="ownerLastName" value={formData.ownerLastName} onChange={handleInputChange} error={errors.ownerLastName} />
              <InputField label="Personal Cell" name="personalPhone" value={formData.personalPhone} onChange={handleInputChange} />
              <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} />
              <div className="md:col-span-2">
                <InputField label="Social Security Number (SSN)" name="ssn" value={formData.ssn} onChange={handleInputChange} error={errors.ssn} placeholder="XXX-XX-XXXX" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="Required Documents" description="Upload clear digital copies" />
            <div className="space-y-4">
              <FileUploadField label="Driver's License" field="driversLicense" file={uploadedFiles.driversLicense} onChange={handleFileChange} error={errors.driversLicense} />
              <FileUploadField label="Business License" field="businessLicense" file={uploadedFiles.businessLicense} onChange={handleFileChange} error={errors.businessLicense} />
              <FileUploadField label="Void Check" field="voidCheck" file={uploadedFiles.voidCheck} onChange={handleFileChange} error={errors.voidCheck} />
              <FileUploadField label="Additional Documents" field="additionalDocument" file={uploadedFiles.additionalDocument} onChange={handleFileChange} optional />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="Terms & Disclaimer" description="Review and authorize your application" />
            <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6 text-stone-600 space-y-4">
              <p className="text-sm leading-relaxed font-medium">
                By submitting the required documents, I’ve authorized Bizz POS to process my application for the merchant services as per agreed terms i.e., To Lease/Own/Rent/Buyout.
              </p>
              <div className="pt-4 border-t border-stone-200">
                <p className="text-[10px] font-black text-[#8B3DA5] uppercase mb-1 tracking-widest">Disclaimer:</p>
                <p className="text-xs leading-relaxed opacity-80 italic text-stone-500">
                  This company complies with Payment Card Industry Data Security Standards (PCI-DSS). Your information will be kept private and confidential, and will be submitted directly to a secure merchant processing portal.
                </p>
              </div>
            </div>

            <label className="flex items-start gap-4 p-5 border border-stone-100 rounded-2xl hover:bg-stone-50 cursor-pointer transition-all group">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 rounded text-[#8B3DA5] focus:ring-[#8B3DA5]/20 border-stone-300"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />
              <span className="text-sm font-bold text-stone-700 select-none">
                I understand and agree to the terms mentioned above.
              </span>
            </label>
            {errors.agree && <p className="text-rose-500 text-xs font-bold px-1 uppercase tracking-tight">{errors.agree}</p>}
          </div>
        )}

        <div className="mt-10 flex gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="px-8 py-4 border border-stone-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-stone-500 hover:bg-stone-50 transition-all disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 px-8 py-4 bg-stone-950 hover:bg-[#8B3DA5] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-stone-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <><Loader className="animate-spin" size={16} /> Processing...</> : step === 4 ? 'Submit Application' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-b border-stone-100 pb-4">
      <h3 className="text-xl font-black text-stone-900 tracking-tight uppercase">{title}</h3>
      <p className="text-xs font-medium text-stone-400 mt-1">{description}</p>
    </div>
  );
}

function InputField({ label, name, error, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{label}</label>
      <input
        name={name}
        {...props}
        className={`w-full px-5 py-4 rounded-2xl border transition-all outline-none text-sm font-medium ${
          error 
            ? 'border-rose-200 bg-rose-50 focus:border-rose-500' 
            : 'border-stone-100 bg-stone-50/30 focus:border-[#8B3DA5] focus:bg-white focus:ring-4 focus:ring-[#8B3DA5]/5'
        }`}
      />
      {error && <p className="text-[10px] text-rose-500 font-bold ml-1 uppercase tracking-tighter">{error}</p>}
    </div>
  );
}

function FileUploadField({ label, field, file, onChange, error, optional }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
        {label} {optional && <span className="text-stone-300 font-medium lowercase">(optional)</span>}
      </label>
      <div className={`relative group border-2 border-dashed rounded-2xl p-5 transition-all ${
        error 
          ? 'border-rose-200 bg-rose-50' 
          : file 
            ? 'border-[#8B3DA5] bg-[#8B3DA5]/5' 
            : 'border-stone-100 hover:border-[#8B3DA5]/40 bg-stone-50/30'
      }`}>
        {!file ? (
          <label className="flex flex-col items-center justify-center py-4 cursor-pointer">
            <Upload className="text-stone-300 group-hover:text-[#8B3DA5] transition-colors mb-3" size={24} />
            <span className="text-[10px] font-black text-stone-400 group-hover:text-stone-600 transition-colors uppercase tracking-widest">Upload File</span>
            <input type="file" className="hidden" onChange={(e) => onChange(field, e.target.files?.[0] || null)} />
          </label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#8B3DA5] p-3 rounded-xl text-white shadow-lg shadow-[#8B3DA5]/20">
                <FileText size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-stone-700 truncate max-w-[180px]">{file.name}</span>
                <span className="text-[9px] text-[#8B3DA5] font-black uppercase tracking-widest mt-0.5">Ready for Transfer</span>
              </div>
            </div>
            <button 
              onClick={() => onChange(field, null)} 
              className="p-2 bg-white rounded-full text-stone-400 hover:text-rose-500 transition-all shadow-sm border border-stone-100 hover:border-rose-100"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-[10px] text-rose-500 font-bold ml-1 uppercase tracking-tighter">{error}</p>}
    </div>
  );
}