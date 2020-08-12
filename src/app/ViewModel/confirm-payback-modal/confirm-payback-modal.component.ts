import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {currencyMap} from '../../DataModel/Utils/Currency';
import {Recommendation} from '../../DataModel/Group/Recommendation';


export interface ConfirmPaybackDialogData {
  recommendation: Recommendation;
  confirm: boolean;
}

@Component({
  selector: 'app-confirm-payback-modal',
  templateUrl: './confirm-payback-modal.component.html',
  styleUrls: ['./confirm-payback-modal.component.css']
})
export class ConfirmPaybackModalComponent {

  currencyMap = currencyMap;

  constructor(
    public dialogRef: MatDialogRef<ConfirmPaybackModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmPaybackDialogData) {
  }

  /**
   * Close the dialog without saving
   */
  public onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Close the dialog and return the data
   */
  public onSave(): void {
    this.data.confirm = true;
    this.dialogRef.close(this.data);
  }

}
