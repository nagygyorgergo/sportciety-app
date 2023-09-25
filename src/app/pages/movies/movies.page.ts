import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {

  movies: any = [];
  currentPage = 1;
  imageBaseUrl = environment.images;

  constructor(
    private movieService: MovieService,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth
    ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.email + ' ' + user.uid);
        /* this.userEmail = user.email;
        this.userUid = user.uid;

        this.userService.getUsernameById(this.userUid).subscribe(username => {
          this.userName = username;
        }); */
      } else {
        console.log("not logged in")
      } 
    });
    this.loadMovies();
  }

  async loadMovies(event?: InfiniteScrollCustomEvent){
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'bubbles'
    });
    await loading.present();

    this.movieService.getTopratedMovies(this.currentPage).subscribe(res =>{
      loading.dismiss();
      this.movies.push(...res.results);
      console.log(res);

      event?.target.complete();
      if((event)){
        event.target.disabled = res.total_pages == this.currentPage;
      }
    });
  }

  loadMore(event: InfiniteScrollCustomEvent | any){ //amugy nem any, hanem InfiniteScrollCustomEvent a type
    this.currentPage++;
    this.loadMovies(event);
  }

}
