import { supabase } from './supabaseClient';
import { Submission, Message, SubmissionStatus, MessageStatus } from './types';

export const submissionOps = {
  async create(submission: Omit<Submission, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('submissions')
      .insert([submission])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create submission: ${error.message}`);
    return data as Submission;
  },

  // Get submission by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(`Failed to fetch submission: ${error.message}`);
    return data as Submission;
  },

  // Get all submissions for a user
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch submissions: ${error.message}`);
    return data as Submission[];
  },

  // Get all submissions (admin)
  async getAll(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw new Error(`Failed to fetch submissions: ${error.message}`);
    return data as Submission[];
  },

  // Update submission status and notes
  async updateStatus(id: string, status: SubmissionStatus, adminNotes?: string) {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update submission: ${error.message}`);
    return data as Submission;
  },

  // Count submissions by status
  async countByStatus() {
    const statuses: SubmissionStatus[] = ['pending', 'approved', 'rejected'];
    const counts: Record<SubmissionStatus, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    for (const status of statuses) {
      const { count, error } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);
      
      if (!error) counts[status] = count || 0;
    }

    return counts;
  },
};

// Messages Table Operations
export const messageOps = {
  // Create a new message
  async create(message: Omit<Message, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create message: ${error.message}`);
    return data as Message;
  },

  // Get messages for a user
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
    return data as Message[];
  },

  // Get messages for a submission
  async getBySubmissionId(submissionId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: true });
    
    if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
    return data as Message[];
  },

  // Create status update message
  async createStatusMessage(
    submissionId: string,
    userId: string,
    status: MessageStatus,
    notes?: string
  ) {
    const statusMessages: Record<MessageStatus, string> = {
      pending: '📋 Your application has been received and is under review.',
      approved: '✅ Congratulations! Your application has been approved. You can now proceed.',
      rejected: '❌ Your application requires additional information. Please see admin notes.',
    };

    const message = statusMessages[status];
    const fullMessage = notes ? `${message}\n\nAdmin Notes: ${notes}` : message;

    return this.create({
      submission_id: submissionId,
      user_id: userId,
      message: fullMessage,
      status,
    });
  },
};

// File Upload Operations
export const fileOps = {
  // Upload file to Supabase Storage
  async uploadDocument(
    bucket: string,
    path: string,
    file: File
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    
    if (error) throw new Error(`Failed to upload file: ${error.message}`);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  },

  // Delete file from storage
  async deleteDocument(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw new Error(`Failed to delete file: ${error.message}`);
  },

  // Generate secure file path
  generatePath(userId: string, documentType: string, fileName: string): string {
    const timestamp = Date.now();
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${userId}/${documentType}/${timestamp}_${sanitizedName}`;
  },
};
