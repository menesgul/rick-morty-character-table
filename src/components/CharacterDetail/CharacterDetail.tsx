import React from 'react';
import { Character } from '../../types/character';

interface CharacterDetailProps {
  character: Character | null;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({ character }) => {
  if (!character) return null;
  return (
    <div style={{ marginTop: 24, padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>Karakter Detayı</h3>
      <img src={character.image} alt={character.name} width={100} height={100} />
      <p><strong>İsim:</strong> {character.name}</p>
      <p><strong>Durum:</strong> {character.status}</p>
      <p><strong>Tür:</strong> {character.species}</p>
      <p><strong>Cinsiyet:</strong> {character.gender}</p>
      <p><strong>Lokasyon:</strong> {character.location.name}</p>
      <p><strong>Orijin:</strong> {character.origin.name}</p>
      <p><strong>Bölüm Sayısı:</strong> {character.episode.length}</p>
    </div>
  );
};

export default CharacterDetail; 