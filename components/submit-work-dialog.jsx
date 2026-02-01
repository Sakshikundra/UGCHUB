'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UploadCloud, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { submissionSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';

export function SubmitWorkDialog({ gigId, gigTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      gigId: gigId,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit work');
      }

      setIsOpen(false);
      reset();
      router.refresh();
      // Optionally show success toast here
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gradient-purple w-full md:w-auto text-lg px-8">
          Submit Work
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-purple-500/20 glass">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Submit to "{gigTitle}"</DialogTitle>
          <DialogDescription className="text-gray-400">
            Share the link to your content. Ensure it meets all requirements.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <input type="hidden" {...register('gigId')} />

          <div className="space-y-2">
            <Label htmlFor="fileUrl" className="text-white">Content URL</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="fileUrl"
                placeholder="https://drive.google.com/..."
                className="pl-9 bg-black/50 border-gray-800 text-white"
                {...register('fileUrl')}
              />
            </div>
            {errors.fileUrl && <p className="text-red-500 text-sm">{errors.fileUrl.message}</p>}
            <p className="text-xs text-gray-500">
               Provide a direct link to your video/image (Google Drive, Dropbox, Loom, etc.)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional info for the brand..."
              className="bg-black/50 border-gray-800 text-white min-h-[80px]"
              {...register('notes')}
            />
            {errors.notes && <p className="text-red-500 text-sm">{errors.notes.message}</p>}
          </div>

          <DialogFooter>
             <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
             <Button type="submit" className="gradient-purple" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Entry'
                )}
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
