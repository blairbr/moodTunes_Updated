import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Music } from './music';

interface Response {
  toptracks?: Music;
  tracks?: Music;
}

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  apiKey = 'b88d365cdf804155ac40618e402f7ce5';
  //url = "http://localhost:8080/api/V6";
  url = 'http://ws.audioscrobbler.com/2.0/';
  music: Music;
  artist_image_url_in_service: string = 'empty string';

  constructor(private http: HttpClient) {}

  getMusicLanding() {
    const requestUrl =
      this.url +
      '?method=chart.gettoptracks&api_key=' +
      this.apiKey +
      '&format=json';
    this.http.get(requestUrl).subscribe(
      (response: Response) => {
        console.log(response);
        this.music = response.tracks;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  getMusic(method?: string, searchString?: string) {
    let requestUrl;
    if (method === 'artist.gettoptracks') {
      requestUrl =
        this.url +
        '?method=' +
        method +
        '&artist=' +
        searchString +
        '&api_key=b88d365cdf804155ac40618e402f7ce5&format=json';
      this.http.get(requestUrl).subscribe(
        (response: Response) => {
          console.log('Get music resPonse!', response);

          this.music = response.toptracks;
          this.getImage(this.music.track[0].artist.mbid);
        },
        (error) => {
          console.error(error);
        }
      );
    } else if (method === 'track.search') {
      console.log('entered else if for track search');
      requestUrl =
        this.url +
        '?method=' +
        method +
        '&track=' +
        searchString +
        '&api_key=b88d365cdf804155ac40618e402f7ce5&format=json';

    } else {
      requestUrl =
        this.url +
        '?method=' +
        method +
        '&tag=' +
        searchString +
        '&api_key=b88d365cdf804155ac40618e402f7ce5&format=json';
      console.log('requestURL:', requestUrl);

      if (method === 'tag.gettoptracks') {
        this.http.get(requestUrl).subscribe(
          (response: Response) => {
            console.log(response);
            this.music = response.tracks;
          },
          (error) => {
            console.error(error);
          }
        );
      }
    }

    this.http.get(requestUrl).subscribe(
      (response: Response) => {
        console.log(response);
        this.music = response.toptracks;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // new method - Blair
  getImage(mbid: string) : string {
    if (mbid) {
      const url =
        'https://musicbrainz.org/ws/2/artist/' +
        mbid +
        '?inc=url-rels&fmt=json';
      console.log("URL: ", url);
      fetch(url)
        .then((res) => res.json())
        .then((out) => {
          const relations = out.relations;
          console.table(relations);
          // Find image relation
          for (let i = 0; i < relations.length; i++) {
            if (relations[i].type === 'image') {
              let image_url = relations[i].url.resource;
              if (
                image_url.startsWith('https://commons.wikimedia.org/wiki/File:')
              ) {
                const filename = image_url.substring(
                  image_url.lastIndexOf('/') + 1
                );
                image_url =
                  'https://commons.wikimedia.org/wiki/Special:Redirect/file/' +
                  filename;
              }
              console.log("image url:", image_url);
              this.artist_image_url_in_service = image_url
              return image_url;
            }
          }
        })
        .catch((err) => {
            throw console.log(err);
          });
        }
        return this.artist_image_url_in_service;            
  }
}
