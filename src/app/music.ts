 export interface Music {
   "@attr":{
      artist:string;
    }; 
    track?:Track [];
    moodTracks?:Moodtracks [];
   }

   export interface Track {
    name: string;
    url: string;
    artist?: any;  //changed the type to any so that you can access the mbid on the artist object on line 53 in the MusicService. if you want this to be strongly typed you can create an Artist interface
    image: string[];
    mbid: string;

    artist_image_url?: string;

  }
  export interface Moodtracks {
    artist?:{
      name:string;
      mbid:string;
      url:string;
    };
    url?: string;
    name?: string;
    image?: string;
    }


