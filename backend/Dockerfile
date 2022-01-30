FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app
COPY *.csproj .
RUN dotnet restore --disable-parallel

COPY ./Models ./Models
COPY ./Controllers ./Controllers
COPY Program.cs .
COPY appsettings.json .
COPY appsettings.Development.json .

RUN dotnet build -c Release --no-restore
RUN dotnet publish -c Release -o out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/out .
COPY run_server.sh .
COPY empty-personnel.db /app/personnel.db

RUN find .

EXPOSE 80

ENTRYPOINT [ "/app/run_server.sh" ]

