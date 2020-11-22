import * as React from 'react';
import ReactDom from 'react-dom';
import { SongForm, EditSongForm } from './index';

it('renders SongForm without crashing', () => {
  const div = document.createElement('div');
  ReactDom.render(<SongForm onSubmit={jest.fn} />, div);
});

it('renders EditSongForm without crashing', () => {
  const div = document.createElement('div');
  ReactDom.render(<EditSongForm onSubmit={jest.fn} song={jest.fn()} />, div);
});
