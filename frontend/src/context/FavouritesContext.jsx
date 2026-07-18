import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const FavouritesContext = createContext();

export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedFavs = localStorage.getItem('elboutique_favourites');
    if (savedFavs) {
      try {
        setFavourites(JSON.parse(savedFavs));
      } catch (error) {
        console.error('Failed to parse favourites from local storage', error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('elboutique_favourites', JSON.stringify(favourites));
    }
  }, [favourites, isLoaded]);

  const toggleFavourite = (product) => {
    setFavourites(prev => {
      const exists = prev.some(item => item._id === product._id);
      if (exists) {
        toast.success('Removed from favourites');
        return prev.filter(item => item._id !== product._id);
      } else {
        toast.success('Added to favourites');
        return [...prev, product];
      }
    });
  };

  const isFavourite = (productId) => {
    return favourites.some(item => item._id === productId);
  };

  return (
    <FavouritesContext.Provider value={{
      favourites,
      toggleFavourite,
      isFavourite,
      favouritesCount: favourites.length
    }}>
      {children}
    </FavouritesContext.Provider>
  );
};
