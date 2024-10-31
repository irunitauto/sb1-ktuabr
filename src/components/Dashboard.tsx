import React, { useState, useEffect, useCallback } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useDropzone } from 'react-dropzone';
import { Facebook, FileSpreadsheet, Clock, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import { FacebookProvider, LoginButton, Page } from 'react-facebook';
import * as XLSX from 'xlsx';

const FACEBOOK_APP_ID = '123456789012345';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

function Dashboard() {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isFacebookConnected, setIsFacebookConnected] = useState(false);
  const [facebookPages, setFacebookPages] = useState<FacebookPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);
  const [interval, setInterval] = useState(30);
  const [logs, setLogs] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [sheetId, setSheetId] = useState('');
  const [uploadedFile, setUploadedFile] = useState<FileInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          setUploadedFile({
            name: file.name,
            size: file.size,
            type: file.type
          });
          
          addLog(`Successfully processed ${file.name}`);
          toast.success('File processed successfully!');
        } catch (error) {
          toast.error('Error processing file');
          addLog('Error processing file');
        }
        setIsProcessing(false);
      };
      
      reader.readAsBinaryString(file);
    } catch (error) {
      setIsProcessing(false);
      toast.error('Error reading file');
      addLog('Error reading file');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds 5MB limit');
        addLog('File size error: exceeds 5MB limit');
        return;
      }
      processFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    setIsGoogleConnected(true);
    addLog('Connected to Google successfully');
    toast.success('Google authentication successful!');
  };

  const handleGoogleError = () => {
    toast.error('Google authentication failed');
    addLog('Google authentication failed');
  };

  const handleFacebookSuccess = async (response: any) => {
    try {
      setIsProcessing(true);
      const { accessToken } = response;
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`
      );
      const pagesData = await pagesResponse.json();
      
      setFacebookPages(pagesData.data);
      setIsFacebookConnected(true);
      addLog('Connected to Facebook successfully');
      toast.success('Facebook authentication successful!');
    } catch (error) {
      console.error('Facebook auth error:', error);
      toast.error('Facebook authentication failed');
      addLog('Facebook authentication failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePageSelect = (page: FacebookPage) => {
    setSelectedPage(page);
    addLog(`Selected Facebook page: ${page.name}`);
    toast.info(`Selected page: ${page.name}`);
  };

  const togglePosting = () => {
    if (!selectedPage) {
      toast.error('Please select a Facebook page first');
      return;
    }
    
    if (!uploadedFile && !sheetId) {
      toast.error('Please provide a data source first');
      return;
    }

    setIsPosting(!isPosting);
    addLog(isPosting ? 'Posting stopped' : 'Posting started');
    toast.info(isPosting ? 'Posting stopped' : 'Posting started');
  };

  const handleSheetIdSubmit = () => {
    if (!sheetId.trim()) {
      toast.error('Please enter a valid Sheet ID');
      return;
    }
    
    if (!isGoogleConnected) {
      toast.error('Please connect to Google first');
      return;
    }

    addLog(`Google Sheet ID set: ${sheetId}`);
    toast.success('Sheet ID saved successfully');
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <span>Google Account</span>
              </div>
              {!isGoogleConnected ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                />
              ) : (
                <span className="text-green-500 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Connected
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Facebook className="h-5 w-5 text-blue-600" />
                <span>Facebook Pages</span>
              </div>
              {!isFacebookConnected ? (
                <FacebookProvider appId={FACEBOOK_APP_ID}>
                  <LoginButton
                    scope="pages_manage_posts,pages_read_engagement"
                    onSuccess={handleFacebookSuccess}
                    onError={(error) => {
                      console.error('Facebook Login Error:', error);
                      toast.error('Facebook login failed');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Connecting...' : 'Connect'}
                  </LoginButton>
                </FacebookProvider>
              ) : (
                <span className="text-green-500 flex items-center">
                  <Facebook className="h-4 w-4 mr-1" />
                  Connected
                </span>
              )}
            </div>

            {/* Facebook Pages Selection */}
            {isFacebookConnected && facebookPages.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Facebook Page
                </label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedPage?.id || ''}
                  onChange={(e) => {
                    const page = facebookPages.find(p => p.id === e.target.value);
                    if (page) handlePageSelect(page);
                  }}
                >
                  <option value="">Select a page</option>
                  {facebookPages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Data Source Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Data Source</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Google Sheet ID
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={sheetId}
                  onChange={(e) => setSheetId(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter Sheet ID"
                  disabled={!isGoogleConnected}
                />
                <button
                  onClick={handleSheetIdSubmit}
                  disabled={!isGoogleConnected || !sheetId.trim() || isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            
            <div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-500'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} disabled={isProcessing} />
                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
                {isProcessing ? (
                  <p className="mt-2 text-sm text-gray-600">Processing file...</p>
                ) : uploadedFile ? (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                ) : (
                  <>
                    <p className="mt-2 text-sm text-gray-600">
                      Drag & drop a file here, or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports CSV and XLSX files (max 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posting Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Posting Controls</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Posting Interval (minutes)
            </label>
            <input
              type="range"
              min="30"
              max="50"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600">{interval} minutes</span>
          </div>

          <button
            onClick={togglePosting}
            disabled={!selectedPage || (!uploadedFile && !sheetId) || isProcessing}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
              !selectedPage || (!uploadedFile && !sheetId) || isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : isPosting
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isProcessing ? 'Processing...' : isPosting ? 'Stop Posting' : 'Start Posting'}
          </button>
          
          {!selectedPage && (
            <p className="text-sm text-red-500">
              Please select a Facebook page before starting
            </p>
          )}
          {!uploadedFile && !sheetId && (
            <p className="text-sm text-red-500">
              Please provide a data source (Sheet ID or file upload)
            </p>
          )}
        </div>
      </div>

      {/* Logs Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>
        <div className="h-48 overflow-y-auto bg-gray-50 p-4 rounded border">
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No activity logs yet</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-sm text-gray-600 mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;