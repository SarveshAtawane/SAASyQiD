import React, { useState } from 'react';
import { Upload, Link } from 'lucide-react';
import './Information.css';

const Information = () => {
  const [files, setFiles] = useState([]);
  const [githubLink, setGithubLink] = useState('');
  const [websiteLinks, setWebsiteLinks] = useState(['']);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prevFiles => {
      // Combine existing files with new ones, avoiding duplicates
      const uniqueFiles = [...prevFiles, ...newFiles].reduce((acc, file) => {
        if (!acc.find(existingFile => existingFile.name === file.name)) {
          acc.push(file);
        }
        return acc;
      }, []);
      return uniqueFiles;
    });
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleWebsiteLinkChange = (index, value) => {
    const newLinks = [...websiteLinks];
    newLinks[index] = value;
    setWebsiteLinks(newLinks);
  };

  const addWebsiteLink = () => {
    setWebsiteLinks([...websiteLinks, '']);
  };

  const removeWebsiteLink = (index) => {
    const newLinks = websiteLinks.filter((_, i) => i !== index);
    setWebsiteLinks(newLinks);
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      
      // Append files
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Append GitHub link if provided
      if (githubLink) {
        formData.append('github_repo_link', githubLink);
      }
      
      // Append website links if provided
      websiteLinks.forEach(link => {
        if (link) {
          formData.append('website_link', link);
        }
      });

      const response = await fetch('http://localhost:8000/doc_upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('apiKey')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Clear form after successful upload
      setFiles([]);
      setGithubLink('');
      setWebsiteLinks(['']);
      
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>DocuAI</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="/dashboard">Dashboard</a>
          <a href="#" className="active">Add Information</a>
          <a href="/settings">Settings</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="page-title">Add Information</h1>
        
        <div className="upload-sections">
          {/* Document Upload Section */}
          <div className="upload-card">
            <div className="card-header">
              <h2>
                <Upload size={20} />
                Upload Documents
              </h2>
            </div>
            <div className="card-content">
              <input
                type="file"
                multiple
                accept=".txt,.pdf"
                onChange={handleFileChange}
                className="file-input"
              />
              <div className="file-types">
                Supported formats: PDF, TXT
              </div>
              {files.length > 0 && (
                <div className="selected-files">
                  <h4>Selected files:</h4>
                  <ul>
                    {files.map((file, index) => (
                      <li key={index} className="file-item">
                        {file.name}
                        <button
                          onClick={() => removeFile(index)}
                          className="remove-button"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Website Links */}
          <div className="upload-card">
            <div className="card-header">
              <h2>
                <Link size={20} />
                Website Links
              </h2>
            </div>
            <div className="card-content">
              <div className="website-links">
                {websiteLinks.map((link, index) => (
                  <div key={index} className="website-link-input">
                    <input
                      type="url"
                      placeholder="Enter website URL"
                      value={link}
                      onChange={(e) => handleWebsiteLinkChange(index, e.target.value)}
                      className="text-input"
                    />
                    {websiteLinks.length > 1 && (
                      <button
                        className="remove-button"
                        onClick={() => removeWebsiteLink(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  onClick={addWebsiteLink} 
                  className="add-button"
                >
                  Add Another Website Link
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={uploading || (files.length === 0 && !githubLink && websiteLinks.every(link => !link))}
            className="submit-button"
          >
            {uploading ? 'Uploading...' : 'Upload All'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Information;