import { Injectable } from '@angular/core';
import axios from 'axios';
import { Releases } from '../../models/release/release.model';

@Injectable({ providedIn: 'root' })
export class ReleasesService {
  private apiUrl = '/api/releases';

  // GET all releases
  async getAll(bandSlug?: string): Promise<Releases[]> {
    const url = bandSlug
    ? `${this.apiUrl}?bandSlug=${bandSlug}`
    : this.apiUrl;

  const res = await axios.get<Releases[]>(url);
  return res.data;
  }

  // GET releases by type (if backend supports it)
  async getByType(type: Releases['type']): Promise<Releases[]> {
    const res = await axios.get<Releases[]>(`${this.apiUrl}?type=${type}`);
    return res.data;
  }

  // POST a new release
  async create(release: Releases): Promise<Releases> {
    const res = await axios.post<Releases>(this.apiUrl, release);
    return res.data;
  }

  // PUT update release by ID
  async update(id: string, release: Partial<Releases>): Promise<Releases> {
    const res = await axios.put<Releases>(`${this.apiUrl}/${id}`, release);
    return res.data;
  }

  // DELETE release by ID
  async delete(id: string): Promise<void> {
    await axios.delete(`${this.apiUrl}/${id}`);
  }

  // Helpers for calendar endpoints (frontend just opens these URLs)
  getIcsUrl(id: string) {
    return `${this.apiUrl}/${id}/ics`;
  }

  getGoogleUrl(id: string) {
    return `${this.apiUrl}/${id}/google`;
  }
}
