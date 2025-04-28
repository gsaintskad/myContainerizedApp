import React, { useState, useCallback } from 'react';

// Define an interface for the photo data structure
interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

// Define props for the PhotoDisplay component
interface PhotoDisplayProps {
  photo: Photo; // Use the Photo interface for the prop type
}

// Component to display the fetched photo data
// Use React.FC (Functional Component) and specify the props type
const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ photo }) => {
  if (!photo) {
    return null;
  }

  // Handler for image loading errors, typed with React.SyntheticEvent
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.onerror = null; // Prevent infinite loop
    target.src = `https://placehold.co/150x150/cccccc/ffffff?text=Thumb+Error`;
    target.alt = 'Thumbnail failed to load';
  };

   const handleFullImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
     e.currentTarget.style.display = 'none';
   };

  return (
    <div className="mt-6 p-4 border border-gray-300 rounded-lg shadow-md bg-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2 break-words">{photo.title} (ID: {photo.id})</h2>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-shrink-0">
          <p className="text-sm text-gray-600 mb-1">Thumbnail:</p>
          <img
            src={photo.thumbnailUrl}
            alt={`Thumbnail for ${photo.title}`}
            className="w-24 h-24 rounded border border-gray-200"
            onError={handleImageError} // Use the typed error handler
           />
        </div>
        <div className="flex-grow text-center sm:text-left">
          <p className="text-sm text-gray-600 mb-1">Full Image URL:</p>
          <a
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all text-sm"
          >
            {photo.url}
          </a>
           <img
            src={photo.url}
            alt={`Full image for ${photo.title}`}
            className="w-full h-auto rounded border border-gray-200 mt-2 hidden" // Hidden
            onError={handleFullImageError} // Hide if error
           />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">Album ID: {photo.albumId}</p>
    </div>
  );
}

// Main App component (implicitly typed as React.FC by its return type)
function App() {
  // State with type annotations
  const [photoId, setPhotoId] = useState<string>('1'); // ID is kept as string for input control
  const [photoData, setPhotoData] = useState<Photo | null>(null); // Can be Photo object or null
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Error message is a string or null

  // Function to handle fetching photo data
  // useCallback is typed implicitly based on the function signature
  const fetchPhoto = useCallback(async () => {
    const numericPhotoId = Number(photoId);
    if (!photoId || isNaN(numericPhotoId) || numericPhotoId <= 0) {
        setError('Please enter a valid positive Photo ID.');
        setPhotoData(null);
        return;
    }

    setLoading(true);
    setError(null);
    setPhotoData(null);

    try {
      // const url = `${process.env.API_URL}/photos/${photoId}`;

      const url = `http://188.47.68.98:3000/photos/${photoId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Assume the fetched data matches the Photo interface
      const data: Photo = await response.json();
      setPhotoData(data);

    } catch (err) {
      console.error("Fetch error:", err);
      // Check if err is an instance of Error before accessing message
      if (err instanceof Error) {
          setError(err.message);
      } else {
          setError('Failed to fetch photo data. An unknown error occurred.');
      }
      setPhotoData(null);
    } finally {
      setLoading(false);
    }
  }, [photoId]); // Dependency array

  // Handle input changes with correct event type
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoId(event.target.value);
  };

  // Handle form submission with correct event type
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchPhoto();
  };

  return (
    <div className="container mx-auto p-4 font-sans text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">React Photo Fetcher (TS)</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex justify-center items-center gap-2">
        <label htmlFor="photoIdInput" className="sr-only">Photo ID:</label>
        <input
          id="photoIdInput"
          type="number"
          value={photoId}
          onChange={handleInputChange} // Typed event handler
          placeholder="Enter Photo ID (e.g., 1)"
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-40"
          min="1"
        />
        <button
          type="submit"
          // onClick={fetchPhoto} // onClick is redundant here as button type is submit
          disabled={loading || !photoId}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Fetch Photo'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md max-w-md mx-auto">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Pass the typed photoData to the typed component */}
      {!error && photoData && <PhotoDisplay photo={photoData} />}

       {!loading && !error && !photoData && photoId && (
         <p className="text-gray-500 mt-4">Click "Fetch Photo" to load data for ID {photoId}.</p>
       )}
        {!loading && !error && !photoData && !photoId && (
         <p className="text-gray-500 mt-4">Enter a Photo ID and click "Fetch Photo".</p>
       )}

    </div>
  );
}

export default App;
