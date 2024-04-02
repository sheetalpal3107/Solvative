import React, { useState, useEffect, useRef } from 'react';
import './style.css';

const citiesData = [
  { id: "1", name: "Paris",  country: "France",  flag_image: "https://flagpedia.net/data/flags/normal/fr.png"},
  { id: "2", name: "New York", country: "United States", flag_image: "https://flagpedia.net/data/flags/normal/us.png"},
  { id: "3", name: "Tokyo", country: "Japan" , flag_image: "https://flagpedia.net/data/flags/normal/jp.png"},
  { id: "4", name: "London", country: "Uk", flag_image: "https://flagpedia.net/data/flags/normal/gb.png" },
  { id: "5", name: "Berlin", country: "Germany", flag_image: "https://flagpedia.net/data/flags/normal/de.png" },
  { id: "6", name: "Rome", country: "Ttlay", flag_image: "https://flagpedia.net/data/flags/normal/it.png" },
  { id: "7", name: "Sydney", country: "Australia", flag_image: "https://flagpedia.net/data/flags/normal/au.png "},
  { id: "8", name: "Moscow", country: "Russia", flag_image: "https://flagpedia.net/data/flags/normal/ru.png" },
  { id: "9", name: "Cario", country: "Egypt", flag_image: "https://flagpedia.net/data/flags/normal/eg.png" },
  { id: "10", name: "Rio De Janeiro", country: "Brazil", flag_image: "https://flagpedia.net/data/flags/normal/br.png" },
];

const App = () => {
  const [searchInput, setSearchInput] = useState('');
  const [cityCount, setCityCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        searchInputRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / cityCount)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleUpdateCityCount = (e) => {
    const count = parseInt(e.target.value);
    if (count >= 1 && count <= 10) {
      setCityCount(count);
      setCurrentPage(1);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      if (!searchInput) {
        setSearchResults([]);
      } else {
        const filteredResults = citiesData.filter(city =>
          city.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setSearchResults(filteredResults);
        setCurrentPage(1); // Reset page to 1 when searching
      }
      setLoading(false);
    }, 1000);
  };

  const filteredData = searchResults.length > 0 ? searchResults : citiesData;

  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="3" className="loading">
            <div className="spinner"></div>
          </td>
        </tr>
      );
    } else if (filteredData.length === 0) {
      return (
        <tr>
          <td colSpan="3">No result found</td>
        </tr>
      );
    } else {
      return filteredData.slice((currentPage - 1) * cityCount, currentPage * cityCount).map((city, index) => (
        <tr key={city.id}>
          <td>{(currentPage - 1) * cityCount + index + 1}</td>
          <td>{city.name}</td>
          <td>{city.country}   <span>  <img src={city.flag_image}/>  </span>  </td>
        </tr>
      ));
    }
  };
  return (
    <div className="container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search places..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleSearch();
          }}
          className={searchInput ? 'filled' : ''}
          ref={searchInputRef}
        />
        <span className="search-icon">
        <button onClick={() => setCurrentPage(1)}>Ctrl + /</button>
        </span>
      </div>
      <div className="table-container">
      {searchInput === '' && (
        <div className="search-message">
          Start searching...
        </div>
      )}
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Place Name</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
      </div>
      {filteredData.length > 0 && (
        <div className="pagination-container">
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>{`Page ${currentPage}`}</span>
            <button onClick={handleNextPage} disabled={currentPage >= Math.ceil(filteredData.length / cityCount)}>
              Next
            </button>
          </div>
          <div className="city-input">
            <label htmlFor="cityCount">Number of Cities:</label>
            <input
              type="number"
              id="cityCount"
              min="1"
              max="10"
              value={cityCount}
              onChange={handleUpdateCityCount}
            />
            <button onClick={handleSearch}>Update</button>
          </div>
        </div>
      )}
     
    </div>
  );
};

export default App;
