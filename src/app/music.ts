 export interface Music {
   "@attr":{
      artist:string;
    }; 
    track?:Track [];
    moodTracks?:Moodtracks [];

    artist_image_url?: string [];

    
   }
   export interface Track {
    name: string;
    url: string;
    // artist: string[];
    artist?: any;
    // artistArray: Artist[];
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

    export interface Artist {
      name?: string;
      mbid?: string;
    }


