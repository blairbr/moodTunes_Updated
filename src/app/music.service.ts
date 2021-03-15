import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Music } from './music';
import { Track } from './track';

interface Response {
  toptracks?: Music;
  tracks?: Music;
  //page: number;
}

// interface TrackResponse {
//   songResults: Track[];
// }

//interface Music{
// type?:string;
///name?:string;
//tag_en:string;
//}

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

          this.music = response.toptracks; //is that right? should it be response.tracks?
          const thing = response.toptracks; //is that right? should it be response.tracks?

          console.log('THIS.MUSIC', this.music);

          console.log('ARTIST mbid', this.music.track[0].artist.mbid);

          const image_responseURL = this.getImage(this.music.track[0].artist.mbid);
          console.log("IMAGE RESPONSE URL", image_responseURL);
          //get the "79239441-bfd5-4981-a70c-55c3f15c1287" mbid once for the artist
          
          //console.log("looping over tracks: MBID: ", this.music);
          // track.artist_image_url = this.getImage(track.mbid); //why isnt this returning anythign?

          // for (const track of this.music.track) {
          //   console.log("ENTERED FOR LOOP ON LINE 70 of music service")
          //   console.log("looping over tracks: MBID: ", track.mbid);
          //   track.artist_image_url = this.getImage(track.mbid); //why isnt this returning anythign?
          //   console.log("track.artist_image_url: ", track.artist_image_url);
          // }

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
      //blair added this
      this.http.get(requestUrl).subscribe(
        (response: Response) => {
          console.log('Get TRACKS response', response);
          this.music = response.toptracks; //is that right? should it be response.tracks?
        },
        (error) => {
          console.error(error);
        }
      );
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
    //console.log(type);
    //blair commented this out
    // this.http.get(requestUrl).subscribe(
    //   (response: Response) => {
    //     console.log(response);
    //     this.music = response.toptracks;
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
  }

  //will need to take in mbid
  getImage(mbid) : string {
    console.log("CALLED GET IMAGE()");
    if (mbid) {
      console.log("MBID IN GET IMAGE::: ", mbid);
     //blair remove this hard coded stuff
     //mbid = 'fab34286-b8e1-4879-bce3-194e1358fbd2'

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
              console.log(image_url);
              this.artist_image_url_in_service = image_url
              return image_url;
            }
          }
        })
        // .catch((err) => {
          //   throw console.log(err);
          // });
        }
        return this.artist_image_url_in_service;        
        // return 'https://upload.wikimedia.org/wikipedia/commons/4/43/Ke%24ha_Today_Show_2012.jpg';
    
  }

  // getUrlWithAPIKey() {
  //return `${this.url}?api_key=${this.apiKey}&language=en-US`;
  //return `${this.url}?api_key=${this.apiKey}&language=en-US`;
  //   return `${this.url}?method=${method}?app_key=${this.apiKey}&format=json`;
  // }
}
