import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArtComponent } from './pages/art/art.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CanvasCatalystComponent } from './pages/bands/canvas-catalyst/canvas-catalyst.component';
import { CloudCanvasComponent } from './pages/bands/cloud-canvas/cloud-canvas.component';
import { RyeCanvasComponent } from './pages/bands/rye-canvas/rye-canvas.component';
import { WailingCanvasComponent } from './pages/bands/wailing-canvas/wailing-canvas.component';
import { PhosphorescentCanvasComponent } from './pages/bands/phosphorescent-canvas/phosphorescent-canvas.component';
import { FlickeringCanvasComponent } from './pages/bands/flickering-canvas/flickering-canvas.component';
import { StaindGlassCanvasComponent } from './pages/bands/staind-glass-canvas/staind-glass-canvas.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'art', component: ArtComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'bands/canvas-catalyst', component: CanvasCatalystComponent },
  { path: 'bands/cloud-canvas', component: CloudCanvasComponent },
  { path: 'bands/rye-canvas', component: RyeCanvasComponent },
  { path: 'bands/wailing-canvas', component: WailingCanvasComponent },
  { path: 'bands/phosphorescent-canvas', component: PhosphorescentCanvasComponent },
  { path: 'bands/flickering-canvas', component: FlickeringCanvasComponent },
  { path: 'bands/staind-glass-canvas', component: StaindGlassCanvasComponent }
];
