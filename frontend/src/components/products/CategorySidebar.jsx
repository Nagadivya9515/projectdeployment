
const CategorySidebar = ( { sections, onCategoryClick }) => {
    <div className="bg-white shadow rounded-xl p-4 h-fit sticky top-24">
        <h3 className="font-semibold mb-4 text-gray-900">Select a service</h3>
            <div className="grid grid-cols-2 gap-3">
                {sections.map((section) => {
                    <button
                        key={section.category}
                        onClick = {() => onCategoryClick(section.category)}
                        className="text-sm bg-gray-100 rounded-lg py-3 hover:bg-gray-200 transition capitalize">
                            {section.category}
                    </button>
                })}
            </div>
        </div>
}

export default CategorySidebar;