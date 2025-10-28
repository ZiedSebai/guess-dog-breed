const BASE = 'https://dog.ceo/api';

export async function getBreedList() {
  const res = await fetch(`${BASE}/breeds/list/all`);
  const json = await res.json();
  if (json.status !== 'success') throw new Error('Failed to fetch breed list');

  const flat = [];
  for (const [breed, subs] of Object.entries(json.message)) {
    if (!subs.length) flat.push(breed);
    else subs.forEach(sub => flat.push(`${breed} ${sub}`));
  }
  return flat;
}

export async function getBreedImage(breedName) {
  const [breed, sub] = breedName.split(' ');
  const endpoint = sub
    ? `${BASE}/breed/${breed}/${sub}/images/random`
    : `${BASE}/breed/${breed}/images/random`;

  const res = await fetch(endpoint);
  const json = await res.json();
  if (json.status !== 'success') throw new Error('Failed to fetch image');
  return json.message;
}

export async function getRandomImageAndBreed() {
  const res = await fetch(`${BASE}/breeds/image/random`);
  const json = await res.json();
  if (json.status !== 'success') throw new Error('Failed to fetch random image');
  const url = json.message;

  const match = url.match(/breeds\/([^/]+)\//);
  const slug = match ? match[1] : '';
  const parts = slug.split('-');
  const breedName = parts.length > 1 ? `${parts[0]} ${parts[1]}` : parts[0];
  return { url, breedName };
}