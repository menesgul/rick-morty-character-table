import React from 'react';
import { Character } from '../../types/character';

interface CharacterDetailProps {
  character: Character | null;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({ character }) => {
  if (!character) return null;

  return (
    <div style={{
      margin: '60px auto 40px', // Increased top margin for image positioning
      padding: '64px 24px 32px', // Increased top padding for content spacing
      borderRadius: 30,
      maxWidth: 480,
      backgroundColor: '#ffffff',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
      textAlign: 'center',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      overflow: 'visible', 
      position: 'relative',
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 700,
        color: '#222',
        marginBottom: 16,
        borderBottom: '2px solid #f50057',
        paddingBottom: 8,
        display: 'inline-block'
      }}>
        <p></p>
        Character Detail
      </h2>

      <img
        src={character.image}
        alt={character.name}
        style={{
          width: 150,
          height: 150,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '4px solid white',
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.35)'
        }}
      />

      <div style={{ 
        fontSize: '1.1rem', color: '#444', lineHeight: '1.6',
        paddingTop: '30px'
      }}>
        <p><strong>Name:</strong> {character.name}</p>
        <p><strong>Status:</strong> {character.status}</p>
        <p><strong>Species:</strong> {character.species}</p>
        <p><strong>Gender:</strong> {character.gender}</p>
        <p><strong>Location:</strong> {character.location.name}</p>
        <p><strong>Origin:</strong> {character.origin.name}</p>
        <p><strong>Episode Count:</strong> {character.episode.length}</p>
      </div>
    </div>
  );
};

export default CharacterDetail;
