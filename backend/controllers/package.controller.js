// controllers/package.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse }  from "../utils/ApiResponse.js";
import * as packageService from "../services/package.service.js";

// ─── Package controllers ──────────────────────────────────────

export const getAllPackages = asyncHandler(async (req, res) => {
  const data = await packageService.getAllPackages();
  res.status(200).json(new ApiResponse(200, data, "Packages fetched"));
});

export const getPackageBySlug = asyncHandler(async (req, res) => {
  const data = await packageService.getPackageBySlug(req.params.slug);
  res.status(200).json(new ApiResponse(200, data, "Package fetched"));
});

export const createPackage = asyncHandler(async (req, res) => {
  const data = await packageService.createPackage(req.body);
  res.status(201).json(new ApiResponse(201, data, "Package created"));
});

export const updatePackage = asyncHandler(async (req, res) => {
  const data = await packageService.updatePackage(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, data, "Package updated"));
});

export const deletePackage = asyncHandler(async (req, res) => {
  const data = await packageService.deletePackage(req.params.id);
  res.status(200).json(new ApiResponse(200, data, "Package deleted"));
});

// ─── PackageType controllers ──────────────────────────────────

export const getTypesBySlug = asyncHandler(async (req, res) => {
  const data = await packageService.getTypesBySlug(req.params.slug);
  res.status(200).json(new ApiResponse(200, data, "Package types fetched"));
});

export const getTypeById = asyncHandler(async (req, res) => {
  const data = await packageService.getTypeById(req.params.id);
  res.status(200).json(new ApiResponse(200, data, "Package type fetched"));
});

export const createPackageType = asyncHandler(async (req, res) => {
  const data = await packageService.createPackageType(req.body);
  res.status(201).json(new ApiResponse(201, data, "Package type created"));
});

export const updatePackageType = asyncHandler(async (req, res) => {
  const data = await packageService.updatePackageType(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, data, "Package type updated"));
});

export const deletePackageType = asyncHandler(async (req, res) => {
  const data = await packageService.deletePackageType(req.params.id);
  res.status(200).json(new ApiResponse(200, data, "Package type deleted"));
});