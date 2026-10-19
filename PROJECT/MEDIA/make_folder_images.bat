if not exist "..\CODE\public\static\image\%1" mkdir "..\CODE\public\static\image\%1"
for %%f in (static\image\%1\*.*) do (
    %TOOL%\REMIX\remix %2 %TOOL%\IMAGE_MAGICK\magick "%%f" -auto-orient -filter Lanczos -resize "360x720>" -quality 30 -strip "..\CODE\public\static\image\%1\%%~nf.avif.preload.avif"
    %TOOL%\REMIX\remix %2 %TOOL%\IMAGE_MAGICK\magick "%%f" -auto-orient -filter Lanczos -resize "480x960>" -quality @try:60 @try:50 @try:40 @try:30 -strip "@-40k:..\CODE\public\static\image\%1\%%~nf.avif.tiny.avif"
    %TOOL%\REMIX\remix %2 %TOOL%\IMAGE_MAGICK\magick "%%f" -auto-orient -filter Lanczos -resize "640x1280>" -quality @try:60 @try:50 @try:40 @try:30 -strip "@-60k:..\CODE\public\static\image\%1\%%~nf.avif.small.avif"
    %TOOL%\REMIX\remix %2 %TOOL%\IMAGE_MAGICK\magick "%%f" -auto-orient -filter Lanczos -resize "960x1920>" -quality @try:60 @try:50 @try:40 @try:30 -strip "@-80k:..\CODE\public\static\image\%1\%%~nf.avif.medium.avif"
    %TOOL%\REMIX\remix %2 %TOOL%\IMAGE_MAGICK\magick "%%f" -auto-orient -filter Lanczos -resize "1280x2560>" -quality @try:60 @try:50 @try:40 @try:30 -strip "@-120k:..\CODE\public\static\image\%1\%%~nf.avif.wide.avif"
    %TOOL%\REMIX\remix %2 %TOOL%\IMAGE_MAGICK\magick "%%f" -auto-orient -filter Lanczos -resize "1920x1920>" -quality @try:60 @try:50 @try:40 @try:30 -strip "@-160k:..\CODE\public\static\image\%1\%%~nf.avif"
    %TOOL%\REMIX\remix %2 %TOOL%\IMAGE_MAGICK\magick "%%f" -auto-orient -filter Lanczos -resize "2560x2560>" -quality @try:60 @try:50 @try:40 @try:30 -strip "@-240k:..\CODE\public\static\image\%1\%%~nf.avif.big.avif"
    %TOOL%\REMIX\remix %2 %TOOL%\IMAGE_MAGICK\magick "%%f" -auto-orient -filter Lanczos -resize "3840x3840>" -quality @try:60 @try:50 @try:40 @try:30 -strip "@-320k:..\CODE\public\static\image\%1\%%~nf.avif.huge.avif"
    %TOOL%\REMIX\remix %2 %TOOL%\IMAGE_MAGICK\magick "%%f" -auto-orient -filter Lanczos -resize "1200x630^" -gravity center -extent 1200x630 -quality 85 -strip "..\CODE\public\static\image\%1\%%~nf.avif.meta.jpg"
)
