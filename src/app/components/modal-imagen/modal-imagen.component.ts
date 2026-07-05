import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'app-modal-imagen',
    templateUrl: './modal-imagen.component.html',
    styles: [],
    standalone: false
})
export class ModalImagenComponent implements OnInit {
  
  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(event: any) {
    this.imagenSubir = event.target.files[0];

    if (!this.imagenSubir) {this.imgTemp = null;}

    const reader = new FileReader();
    reader.readAsDataURL(this.imagenSubir);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;
    console.log(tipo);
    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo, id || '')
      .then(img => {
        if (!img) {
          Swal.fire('Error', 'No se ha podido cambiar el avatar', 'error');
          return;
        }
        Swal.fire('Guardado', 'Avatar de usuario actualizada', 'success');
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      }).catch( err => {
        Swal.fire('Error', 'No se ha podido cambiar el avatar', 'error');
      });
  }

}
