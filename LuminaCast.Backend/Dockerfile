# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5000
# Important: Map gRPC port explicitly
ENV ASPNETCORE_URLS=http://+:5000

# Build image
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["LuminaCast.Backend.csproj", "LuminaCast.Backend/"]
RUN dotnet restore "LuminaCast.Backend/LuminaCast.Backend.csproj"

# Copy the rest of the code
COPY . ./LuminaCast.Backend/
WORKDIR "/src/LuminaCast.Backend"
RUN dotnet build "LuminaCast.Backend.csproj" -c Release -o /app/build

# Publish image
FROM build AS publish
RUN dotnet publish "LuminaCast.Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final production image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LuminaCast.Backend.dll"]
