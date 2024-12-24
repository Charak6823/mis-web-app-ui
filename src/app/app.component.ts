import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoryMainService } from './services/category-main.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertMessageService } from './services/alert-message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mis-web-ui';
}
