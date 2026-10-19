for %%f in ("static\image\%1\*.png" "static\image\%1\*.jpg") do (
    %TOOL%\LIBAVIF\avifenc --lossless --ignore-exif --ignore-xmp "%%f" "static\image\%1\%%~nf.avif"
    if exist "static\image\%1\%%~nf.avif" (
        del /q "%%f"
    )
)
