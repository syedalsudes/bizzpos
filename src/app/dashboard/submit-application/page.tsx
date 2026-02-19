'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApplicationForm } from '@/components/ApplicationForm';
import { supabase } from '@/lib/supabaseClient';
import { AlertCircle, CheckCircle } from 'lucide-react';
import PremiumLoader from '@/components/PremiumLoader';

export default function SubmitApplicationPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  // YE HAI ASLI LOGIC JO DATA SAVE KAREGA
  const handleFinalSubmit = async (mappedData: any, uploadedFiles: any) => {
    try {
      setSubmitting(true);
      setError(null);

      if (!user) throw new Error('User not authenticated');

      // 1. Pehle Files Upload Karein
      const uploadFile = async (file: File, folder: string) => {
        const filePath = `${user.id}/${folder}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('submissions')
          .upload(filePath, file);
        
        if (uploadError) throw new Error(`File upload error: ${uploadError.message}`);
        
        const { data } = supabase.storage.from('submissions').getPublicUrl(filePath);
        return data.publicUrl;
      };

      const urls = await Promise.all([
        uploadFile(uploadedFiles.driversLicense!, 'drivers_license'),
        uploadFile(uploadedFiles.businessLicense!, 'business_license'),
        uploadFile(uploadedFiles.voidCheck!, 'void_check'),
        uploadedFiles.additionalDocument ? uploadFile(uploadedFiles.additionalDocument, 'additional') : null,
      ]);

      // 2. Phir Database mein Entry Karein
      const { error: dbError } = await supabase.from('applications').insert({
        user_id: user.id,
        ...mappedData, // Isme dba_name, business_phone wagera hain
        drivers_license_url: urls[0],
        business_license_url: urls[1],
        void_check_url: urls[2],
        additional_doc_url: urls[3],
        status: 'pending',
      });

      if (dbError) throw dbError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PremiumLoader />;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {success && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl flex gap-4">
            <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-green-900 mb-1">Application Submitted!</h3>
              <p className="text-green-800">Your application has been received. Redirecting...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl flex gap-4">
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-red-900 mb-1">Submission Failed</h3>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {!success && (
          <ApplicationForm onSubmit={handleFinalSubmit} loading={submitting} />
        )}
      </div>
    </main>
  );
}