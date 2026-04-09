import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userData: any = {
    username: '',
    gender: '',
    height: '',
    weight: '',
    skin: '',
    hair: '',
    face: '',
    style: '',
    weather: ''
  };

}