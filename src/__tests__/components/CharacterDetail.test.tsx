import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, mockCharacter } from '../utils/testUtils';
import CharacterDetail from '../../components/CharacterDetail/CharacterDetail';

describe('CharacterDetail Component', () => {
  it('karakter detaylarını doğru şekilde gösterir', () => {
    renderWithProviders(<CharacterDetail character={mockCharacter} />);
    
    // Başlık kontrolü
    expect(screen.getByText('Character Detail')).toBeInTheDocument();
    
    // Karakter bilgilerinin varlığını kontrol et
    expect(screen.getByText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByText(/Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/Species:/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender:/i)).toBeInTheDocument();
    expect(screen.getByText(/Location:/i)).toBeInTheDocument();
    expect(screen.getByText(/Origin:/i)).toBeInTheDocument();
    expect(screen.getByText(/Episode Count:/i)).toBeInTheDocument();
    
    // Karakter değerlerinin doğruluğunu kontrol et
    expect(screen.getByText(mockCharacter.name)).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.status)).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.species)).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.gender)).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.location.name)).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.origin.name)).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.episode.length.toString())).toBeInTheDocument();
  });

  it('karakter resmini doğru şekilde gösterir', () => {
    renderWithProviders(<CharacterDetail character={mockCharacter} />);
    
    const characterImage = screen.getByAltText(mockCharacter.name);
    expect(characterImage).toBeInTheDocument();
    expect(characterImage).toHaveAttribute('src', mockCharacter.image);
  });

  it('null karakter durumunu işler', () => {
    const { container } = renderWithProviders(<CharacterDetail character={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('stil özelliklerini doğru uygular', () => {
    renderWithProviders(<CharacterDetail character={mockCharacter} />);
    
    const detailContainer = screen.getByText('Character Detail').parentElement;
    expect(detailContainer).toHaveStyle({
      margin: '60px auto 40px',
      padding: '64px 24px 32px',
      borderRadius: '30px',
      backgroundColor: '#ffffff'
    });
    
    const characterImage = screen.getByAltText(mockCharacter.name);
    expect(characterImage).toHaveStyle({
      width: '150px',
      height: '150px',
      borderRadius: '50%'
    });
  });
}); 