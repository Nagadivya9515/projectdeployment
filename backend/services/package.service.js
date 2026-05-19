// services/package.service.js
import { Package }     from "../models/package.model.js";
import { PackageType } from "../models/packagetype.model.js";
import { ApiError }    from "../utils/ApiError.js";

// ─── Package services ─────────────────────────────────────────

export const getAllPackages = async () => {
  return await Package.find({ isActive: true }).sort({ createdAt: -1 });
};

export const getPackageBySlug = async (slug) => {
  const pkg = await Package.findOne({ slug, isActive: true });
  if (!pkg) throw new ApiError(404, `Package "${slug}" not found`);
  return pkg;
};

export const createPackage = async (body) => {
  const { name, slug } = body;

  // check for duplicate slug
  const existing = await Package.findOne({ slug });
  if (existing) throw new ApiError(409, `A package with slug "${slug}" already exists`);

  return await Package.create(body);
};

export const updatePackage = async (id, body) => {
  const updated = await Package.findByIdAndUpdate(id, body, {
    new:           true,   // return updated doc
    runValidators: true,   // run schema validations on update too
  });
  if (!updated) throw new ApiError(404, "Package not found");
  return updated;
};

export const deletePackage = async (id) => {
  const pkg = await Package.findById(id);
  if (!pkg) throw new ApiError(404, "Package not found");

  // business rule: can't delete a package that has types under it
  const typesCount = await PackageType.countDocuments({ packageSlug: pkg.slug });
  if (typesCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete — this package has ${typesCount} package type(s). Delete them first.`
    );
  }

  await pkg.deleteOne();
  return { deletedId: id };
};

// ─── PackageType services ─────────────────────────────────────

export const getTypesBySlug = async (slug) => {
  // also confirm parent package exists
  const pkg = await Package.findOne({ slug });
  if (!pkg) throw new ApiError(404, `No package found with slug "${slug}"`);

  return await PackageType.find({ packageSlug: slug, isActive: true });
};

export const getTypeById = async (id) => {
  const type = await PackageType.findById(id);
  if (!type) throw new ApiError(404, "Package type not found");
  return type;
};

export const createPackageType = async (body) => {
  const { packageSlug } = body;

  // confirm parent package exists before creating a type under it
  const pkg = await Package.findOne({ slug: packageSlug });
  if (!pkg) throw new ApiError(404, `No package found with slug "${packageSlug}"`);

  return await PackageType.create(body);
};

export const updatePackageType = async (id, body) => {
  const updated = await PackageType.findByIdAndUpdate(id, body, {
    new:           true,
    runValidators: true,
  });
  if (!updated) throw new ApiError(404, "Package type not found");
  return updated;
};

export const deletePackageType = async (id) => {
  const type = await PackageType.findByIdAndDelete(id);
  if (!type) throw new ApiError(404, "Package type not found");
  return { deletedId: id };
};