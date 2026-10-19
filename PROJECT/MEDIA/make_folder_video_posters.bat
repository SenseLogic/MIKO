if not exist "..\CODE\public\static\image\%1" mkdir "..\CODE\public\static\image\%1"
for %%f in (static\video\%1\*.mp4) do (
    %TOOL%\REMIX\remix %2 %TOOL%\FFMPEG\bin\ffmpeg -y -i "%%f" -frames:v 1 "static\image\%1\%%~nf_video_frame.png"
    %TOOL%\REMIX\remix %2 %TOOL%\UPSCAYL\upscayl-bin.exe -n upscayl-standard-4x -i "static\image\%1\%%~nf_video_frame.png" -w 3840 -o "static\image\%1\%%~nf_video_background.png"
)
