FROM mcr.microsoft.com/dotnet/core/sdk:3.0 AS build-env
ENV DOTNET_USE_POLLING_FILE_WATCHER 1
ENV ASPNETCORE_URLS="http://+:5000;https://+:5001"
RUN curl -sL https://deb.nodesource.com/setup_12.x |  bash -
RUN apt-get install -y nodejs
WORKDIR /app
COPY *.csproj /app
RUN dotnet restore
ENTRYPOINT ["dotnet", "watch", "run", "--no-restore", "--urls", "https://0.0.0.0:5001;http://0.0.0.0:5000"]

