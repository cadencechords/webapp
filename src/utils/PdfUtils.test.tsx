import { Font } from '@react-pdf/renderer';
import type { ReactElement } from 'react';
import { toPdf } from './PdfUtils';
import type { Song } from '../types';
import OpenSansRegular from '../fonts/OpenSans-Regular.ttf';
import LiberationSansRegular from '../fonts/LiberationSans-Regular.ttf';

// toPdf registers its fonts under the family its page uses, so react-pdf can
// find them when it renders.

function song(font: string | undefined): Song {
  return { id: 1, name: 'Song', content: 'Hello', format: { font } };
}

type Element = ReactElement<{ children: Element; style: object }>;

function pageStyle(pdf: Element) {
  const page = pdf.props.children;
  const view = page.props.children;
  return view.props.style;
}

afterEach(() => {
  vi.restoreAllMocks();
});

test.each([
  ['a supported font', 'Open Sans', 'Open Sans', OpenSansRegular],
  [
    'an unsupported font',
    'Comic Sans',
    'Liberation Sans',
    LiberationSansRegular,
  ],
  ['no font', undefined, 'Liberation Sans', LiberationSansRegular],
])(
  'with %s, registers the family the page uses',
  (_, font, family, regular) => {
    const register = vi.spyOn(Font, 'register').mockImplementation(() => {});

    const pdf = toPdf(song(font), true);

    expect(register).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledWith({
      family,
      fonts: [{ src: regular }],
    });
    expect(pageStyle(pdf)).toEqual({ fontFamily: family });
  }
);
