import { Component, Inject, OnInit } from "@angular/core";
import { UserDetailsPopUpData } from '../../models/user-details';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/projectDashboard/project.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Video } from "../../models/video";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "view-video-dialog",
  templateUrl: "view-video.component.html"
})

export class ViewVideoComponent implements OnInit {
  vid: any;
  safeURL: any;

  constructor(
    private dialogRef: MatDialogRef<ViewVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDetailsPopUpData,
    private router: Router,
    private projectService: ProjectService,
    private _snackBar: MatSnackBar,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getVideo();
  }

  getVideo() {
    const countryId = Number(localStorage.getItem("countryId"));

    this.projectService.getVideos().then(res => {

      // get the video object if callingCode is equal to registered user countryCode
      var dashboardVideo: Video[] = res.data.filter(video => video.countryId === countryId);
      var videoURL: string;

      // If callingCode does not match with registered user countryCode then set default video url
      if (dashboardVideo === [] || dashboardVideo.length === 0) {
        dashboardVideo = res.data.filter(video => video.isDefault === 1);
      }

      const videoId = dashboardVideo[0].videoUrl.split('/')[3].split("=")[1];
      videoURL = "https://www.youtube.com/embed/" + videoId;

      // Final video url
      this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(videoURL);
      console.log(this.safeURL)
    });
  }

  close() {
    this.dialogRef.close(null);
  }

}