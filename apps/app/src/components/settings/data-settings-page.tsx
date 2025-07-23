'use client';

import React, { useState } from 'react';
import { Button } from '@repo/design/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design/components/ui/card';
import { Download, Trash, Spinner } from '@phosphor-icons/react/dist/ssr';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/design/components/ui/alert-dialog';

export function DataSettingsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Call API to generate export
      const response = await fetch('/api/user/export', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `firescrape-data-export-${new Date().toISOString().split('T')[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Your data has been exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteData = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/user/delete-data', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete data');
      }

      toast.success('Your data has been deleted successfully');
      // Refresh the page or redirect
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete data. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Data & Privacy</h1>
        <p className="text-muted-foreground">
          Manage your data and privacy settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle>Export Your Data</CardTitle>
            <CardDescription>
              Download all your scrape history, settings, and other data associated with your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportData}
              disabled={isExporting}
              className="gap-2"
            >
              {isExporting ? (
                <>
                  <Spinner className="w-4 h-4 animate-spin" />
                  Preparing export...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Export All Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Delete Data */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Your Data</CardTitle>
            <CardDescription>
              Permanently delete all your scrape history and cached data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash size={16} />
                  Delete All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your scrape history,
                    saved settings, and any cached data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteData}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <>
                        <Spinner className="w-4 h-4 animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      'Delete All Data'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Privacy Information */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Data Collection</h3>
              <p className="text-sm text-muted-foreground">
                We only collect data necessary to provide our scraping service, including URLs you scrape,
                settings preferences, and basic usage analytics.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Data Retention</h3>
              <p className="text-sm text-muted-foreground">
                Scrape results are retained for 30 days by default. You can delete your data at any time
                using the options above.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Third-Party Sharing</h3>
              <p className="text-sm text-muted-foreground">
                We do not sell or share your personal data with third parties. Your scrape data is private
                and only accessible by you.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}