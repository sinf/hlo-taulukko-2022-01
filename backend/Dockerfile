FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app

COPY . .
RUN find .

#RUN dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design --prerelease
#RUN dotnet add package Microsoft.EntityFrameworkCore
#RUN dotnet add package Microsoft.EntityFrameworkCore.Design --prerelease
#RUN dotnet add package Microsoft.EntityFrameworkCore.SqlServer --prerelease
#RUN dotnet add package Microsoft.EntityFrameworkCore.InMemory

RUN dotnet restore --disable-parallel

RUN dotnet build -c Release --no-restore
RUN dotnet publish -c Release -o out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/out .
COPY --from=build-env /app/Properties/launchSettings.json .

RUN find .

ENTRYPOINT [ "dotnet", "backend.dll" ]

