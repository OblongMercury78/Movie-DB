import React, { useState, useEffect } from 'react';

const MembersPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    release_year: '',
    genre: '',
    link: '',
    staff_name: [],
    role: [],
    studio: [],
    reviewer_id: [],
    rating: [],
    age_rating: [],
  });

  const [movies, setMovies] = useState([]);
  const [changes, setChanges] = useState({
    movies: [],
    productions: [],
    reviews: [],
  });

  useEffect(() => {
    // Fetch the movie list when the component mounts
    fetchMovies();
  }, []); // Empty dependency array ensures this effect runs once on mount

  const fetchMovies = async () => {
    try {
      // Assuming you have an API endpoint to fetch the movie list
      const response = await fetch('/api/movies');
      if (response.ok) {
        const data = await response.json();
        setMovies(data.movies);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleArrayInputChange = (e, field, index) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming you have an API endpoint to handle the form data
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMovies(data.movies);
        setChanges(data.changes);
        setFormData({
          name: '',
          release_year: '',
          genre: '',
          link: '',
          staff_name: [],
          role: [],
          studio: [],
          reviewer_id: [],
          rating: [],
          age_rating: [],
        });
      } else {
        // Handle error cases
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      release_year: '',
      genre: '',
      link: '',
      staff_name: [],
      role: [],
      studio: [],
      reviewer_id: [],
      rating: [],
      age_rating: [],
    });
  };

  const resetChanges = () => {
    window.location.reload();
  };

  return (
    <div>
      <h1>Members Page</h1>

      <h2>Add Movie, Production, and Review</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Movie Name:
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </label>
        <br />

        <label>
          Release Year:
          <input type="number" name="release_year" value={formData.release_year} onChange={handleInputChange} required />
        </label>
        <br />

        <label>
          Genre:
          <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} required />
        </label>
        <br />

        <label>
          Link:
          <input type="text" name="link" value={formData.link} onChange={handleInputChange} required />
        </label>
        <br />

        {/* Production Information */}
        <h3>Production Information</h3>
        {formData.staff_name.map((staff, index) => (
          <div key={index}>
            <label>
              Staff Name:
              <input
                type="text"
                value={staff}
                onChange={(e) => handleArrayInputChange(e, 'staff_name', index)}
                required
              />
            </label>
            <br />
            <label>
              Role:
              <input
                type="text"
                value={formData.role[index]}
                onChange={(e) => handleArrayInputChange(e, 'role', index)}
                required
              />
            </label>
            <br />
            <label>
              Studio:
              <input
                type="text"
                value={formData.studio[index]}
                onChange={(e) => handleArrayInputChange(e, 'studio', index)}
                required
              />
            </label>
            <br />
          </div>
        ))}
        <button type="button" onClick={() => setFormData((prevData) => ({ ...prevData, staff_name: [...prevData.staff_name, ''], role: [...prevData.role, ''], studio: [...prevData.studio, ''] }))}>
          Add Another Production
        </button>
        <br />

        {/* Review Information */}
        <h3>Review Information</h3>
        {formData.reviewer_id.map((reviewer, index) => (
          <div key={index}>
            <label>
              Reviewer ID:
              <input
                type="text"
                value={reviewer}
                onChange={(e) => handleArrayInputChange(e, 'reviewer_id', index)}
                required
              />
            </label>
            <br />
            <label>
              Rating:
              <input
                type="number"
                value={formData.rating[index]}
                onChange={(e) => handleArrayInputChange(e, 'rating', index)}
                required
              />
            </label>
            <br />
            <label>
              Age Rating:
              <input
                type="text"
                value={formData.age_rating[index]}
                onChange={(e) => handleArrayInputChange(e, 'age_rating', index)}
                required
              />
            </label>
            <br />
          </div>
        ))}
        <button type="button" onClick={() => setFormData((prevData) => ({ ...prevData, reviewer_id: [...prevData.reviewer_id, ''], rating: [...prevData.rating, ''], age_rating: [...prevData.age_rating, ''] }))}>
          Add Another Review
        </button>
        <br />

        <button type="submit">Add Movie, Production, and Review</button>
        <button type="button" onClick={resetForm}>
          Reset Form
        </button>
        <button type="button" onClick={resetChanges}>
          Reset Changes
        </button>
      </form>

      <h2>Movie List</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            {/* Display movie information */}
            {movie.name} ({movie.release_year}) - {movie.genre} - {movie.link}
            <ul>
              {movie.productions.map((production) => (
                <li key={production.id}>
                  {production.staff_name} - {production.role} - {production.studio}
                </li>
              ))}
            </ul>
            <ul>
              {movie.reviews.map((review) => (
                <li key={review.id}>
                  Reviewer ID: {review.reviewer_id} - Rating: {review.rating} - Age Rating: {review.age_rating}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MembersPage;
