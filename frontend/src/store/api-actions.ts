import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import {
  setFilms,
  setFilm,
  setLoading as setFilmsIsLoading,
} from './films-data/films-data';
import {
  setFilmsByGenre,
  setLoading as setFilmsByGenreIsLoading,
} from './genre-data/genre-data';
import {
  setActiveFilm,
  setLoading as setFilmIsLoading,
} from './film-data/film-data';
import {
  setSimilarFilms,
  setLoading as setSimilarFilmsIsLoading,
} from './similar-films-data/similar-films-data';
import {
  setReviews,
  setLoading as setReviewsIsLoading,
} from './reviews-data/reviews-data';
import {
  setFavoriteFilms,
  setLoading as setFavoriteFilmsIsLoading,
} from './favorite-films-data/favorite-films-data';
import {
  setPromoFilm,
  setLoading as setPromoFilmIsLoading,
} from './promo-data/promo-data';
import { setUser, setAuthorizationStatus } from './user-data/user-data';
import { AppDispatch, State } from '../types/state';
import { Film } from '../types/film';
import { NewReview } from '../types/new-review';
import { AuthData } from '../types/auth-data';
import { NewFilm } from '../types/new-film';
import {
  APIRoute,
  AuthorizationStatus,
  DEFAULT_GENRE,
  NameSpace,
} from '../const';
import { saveToken, dropToken } from '../services/token';
import { NewUser } from '../types/new-user';
import { errorHandle } from '../services/error-handler';
import { adaptCommentsToClient, adaptFilmsToClient, adaptFilmToClient, adaptUserToClient } from '../adapters/adaptersToClient';
import { adaptAvatarToServer, adaptLoginUserToServer, adaptNewFilmToServer, adaptNewUserToServer } from '../adapters/adaptersToServer';
import FilmDto from '../dto/film/film.dto';
import CommentDto from '../dto/comment/comment.dto';
import LoggedUserDto from '../dto/user/logged-user.dto';
import CreatedUserDto from '../dto/user/created-user.dto';

type AsyncThunkConfig = {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
};

export const fetchFilms = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Films}/fetchFilms`,
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setFilmsIsLoading(true));
    try {
      const { data } = await api.get<FilmDto[]>(APIRoute.Films);
      dispatch(setFilms(adaptFilmsToClient(data)));
    } catch (error) {
      dispatch(setFilms([]));
      errorHandle(error);
    } finally {
      dispatch(setFilmsIsLoading(false));
    }
  }
);

export const fetchFilmsByGenre = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Genre}/fetchFilmsByGenre`,
  async (genre, { dispatch, extra: api }) => {
    dispatch(setFilmsByGenreIsLoading(true));
    try {
      let route = `${APIRoute.Genre}/${genre}`;
      if (genre === DEFAULT_GENRE) {
        route = APIRoute.Films;
      }
      const { data } = await api.get<FilmDto[]>(route);
      dispatch(setFilmsByGenre(adaptFilmsToClient(data)));
    } catch (error) {
      dispatch(setFilmsByGenre([]));
      errorHandle(error);
    } finally {
      dispatch(setFilmsByGenreIsLoading(false));
    }
  }
);

export const fetchFilm = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Film}/fetchFilm`,
  async (id, { dispatch, extra: api }) => {
    dispatch(setFilmIsLoading(true));
    try {
      const { data } = await api.get<FilmDto>(`${APIRoute.Films}/${id}`);
      dispatch(setActiveFilm(adaptFilmToClient(data)));
    } catch (error) {
      dispatch(setActiveFilm(null));
      errorHandle(error);
    } finally {
      dispatch(setFilmIsLoading(false));
    }
  }
);

export const editFilm = createAsyncThunk<void, Film, AsyncThunkConfig>(
  `${NameSpace.Film}/editFilm`,
  async (filmData, { dispatch, extra: api }) => {
    try {
      const { data } = await api.patch<FilmDto>(
        `${APIRoute.Films}/${filmData.id}`,
        adaptNewFilmToServer(filmData)
      );
      dispatch(setActiveFilm(adaptFilmToClient(data)));
    } catch (error) {
      errorHandle(error);
    }
  }
);

export const addFilm = createAsyncThunk<void, NewFilm, AsyncThunkConfig>(
  `${NameSpace.Film}/addFilm`,
  async (filmData, { dispatch, extra: api }) => {
    try {
      const some = adaptNewFilmToServer(filmData);
      const { data } = await api.post<FilmDto>(APIRoute.Add, some);
      dispatch(setActiveFilm(data));
    } catch (error) {
      errorHandle(error);
    }
  }
);

export const deleteFilm = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Film}/deleteFilm`,
  async (id, { dispatch, extra: api }) => {
    try {
      await api.delete(`${APIRoute.Films}/${id}`);
      dispatch(setActiveFilm(null));
    } catch (error) {
      errorHandle(error);
    }
  }
);

export const fetchSimilarFilms = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.SimilarFilms}/fetchSimilarFilms`,
  async (id, { dispatch, extra: api }) => {
    dispatch(setSimilarFilmsIsLoading(true));
    try {
      const { data } = await api.get<FilmDto[]>(
        `${APIRoute.Films}/${id}${APIRoute.Similar}`
      );
      dispatch(setSimilarFilms(adaptFilmsToClient(data)));
    } catch (error) {
      dispatch(setSimilarFilms([]));
      errorHandle(error);
    } finally {
      dispatch(setSimilarFilmsIsLoading(false));
    }
  }
);

export const fetchFavoriteFilms = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.FavoriteFilms}/fetchFavoriteFilms`,
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setFavoriteFilmsIsLoading(true));
    try {
      const { data } = await api.get<FilmDto[]>(`${APIRoute.Favorite}`);
      dispatch(setFavoriteFilms(adaptFilmsToClient(data)));
    } catch (error) {
      errorHandle(error);
    } finally {
      dispatch(setFavoriteFilmsIsLoading(false));
    }
  }
);

export const fetchPromo = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Promo}/fetchPromo`,
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setPromoFilmIsLoading(true));
    try {
      const { data } = await api.get<FilmDto>(`${APIRoute.Promo}`);
      dispatch(setPromoFilm(adaptFilmToClient(data)));
    } catch (error) {
      dispatch(setPromoFilm(null));
      errorHandle(error);
    } finally {
      dispatch(setPromoFilmIsLoading(false));
    }
  }
);

export const setFavorite = createAsyncThunk<void, { id: string; status: number }, AsyncThunkConfig>(
  `${NameSpace.FavoriteFilms}/setFavorite`,
  async ({ id, status }, { dispatch, extra: api }) => {
    try {
      const { data } = await api.post<FilmDto>(
        `${APIRoute.Favorite}/${id}/${status}`
      );
      const adapted = adaptFilmToClient(data);
      dispatch(setFilm(adapted));
    } catch (error) {
      errorHandle(error);
    }
  }
);

export const fetchReviews = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Reviews}/fetchReviews`,
  async (id, { dispatch, extra: api }) => {
    dispatch(setReviewsIsLoading(true));
    try {
      const { data } = await api.get<CommentDto[]>(`${APIRoute.Comments}/${id}`);
      dispatch(setReviews(adaptCommentsToClient(data)));
    } catch (error) {
      dispatch(setReviews([]));
      errorHandle(error);
    } finally {
      dispatch(setReviewsIsLoading(false));
    }
  }
);

export const postReview = createAsyncThunk<void, { id: string; review: NewReview }, AsyncThunkConfig>(
  `${NameSpace.Reviews}/postReview`,
  async ({ id, review }, { dispatch, extra: api }) => {
    dispatch(setReviewsIsLoading(true));
    try {
      await api.post<NewReview>(`${APIRoute.Comments}/${id}`, review);
    } finally {
      dispatch(setReviewsIsLoading(false));
    }
  }
);

export const checkAuth = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.User}/checkAuth`,
  async (_arg, { dispatch, extra: api }) => {
    try {
      const { data } = await api.get<LoggedUserDto>(APIRoute.Login);
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
      dispatch(setUser(adaptUserToClient(data)));
    } catch {
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
      dispatch(setUser(null));
    }
  }
);

export const login = createAsyncThunk<void, AuthData, AsyncThunkConfig>(
  `${NameSpace.User}/login`,
  async (authData, { dispatch, extra: api }) => {
    try {
      const {
        data: { token },
      } = await api.post<LoggedUserDto>(APIRoute.Login, authData);
      saveToken(token);
      dispatch(checkAuth());
    } catch (error) {
      errorHandle(error);
    }
  }
);

export const logout = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.User}/logout`,
  async (_arg, { dispatch, extra: api }) => {
    try {
      await api.delete(APIRoute.Logout);
      dropToken();
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
      dispatch(setUser(null));
    } catch (error) {
      errorHandle(error);
    }
  }
);

export const registerUser = createAsyncThunk<void, NewUser, AsyncThunkConfig>(
  `${NameSpace.User}/register`,
  async (userData, { dispatch, extra: api }) => {
    const { avatar } = userData;

    try {
      const { data } = await api.post<CreatedUserDto>(APIRoute.Register, adaptNewUserToServer(userData));

      const { data: { token } } = await api.post<LoggedUserDto>(APIRoute.Login, adaptLoginUserToServer(userData));
      saveToken(token);

      if (avatar) {
        await api.post(`/${data.id}${APIRoute.SetAvatar}`, adaptAvatarToServer(avatar), {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
    } catch (error) {
      errorHandle(error);
    }
  }
);
