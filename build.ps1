Write-Output "This is a work-in-progress bootstrapper for using the Cake Runner for .Net Core."

dotnet run --project build/Build.csproj -- $args
exit $LASTEXITCODE;