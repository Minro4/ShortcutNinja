import { Box, TextField } from '@material-ui/core';
import MiniSearch, { SearchOptions } from 'minisearch';
import React from 'react';
import { Component, ReactElement } from 'react';
import {
  IShortcutCategory,
  IShortcutDefinition,
  ShortcutCategories,
} from '../Connectors/ShortcutDefinitions';

export interface SearchableDefinition {
  id: string;
  label: string;
  metaTags: string;
  categoryLabel: string;
  category: IShortcutCategory;
  definition: IShortcutDefinition;
}

interface SearchedDefinition {
  category: IShortcutCategory;
  definition: IShortcutDefinition;
}

type SearchProps = {
  categories: Promise<ShortcutCategories>;
  onSearch: (newCategories: ShortcutCategories) => void;
};

export class SearchBar extends Component<SearchProps> {
  private searchOptions: SearchOptions = {
    prefix: true,
    fuzzy: 0.25,
  };

  private miniSearch: MiniSearch;

  constructor(props: SearchProps) {
    super(props);

    this.miniSearch = new MiniSearch({
      fields: ['label', 'metaTags', 'categoryLabel'], // fields to index for full-text search
      storeFields: ['category', 'definition'], // fields to return with search results
    });

    props.categories.then((categories) => {
      const searchables = this.MakeSearchable(categories);
      console.log(searchables);
      this.miniSearch.addAll(searchables);
    });
  }

  render(): ReactElement {
    return (
      <Box className="search-bar-container">
        <form noValidate autoComplete="off">
        <div>
          <TextField
            fullWidth={true}
            size="small"
            label="Search"
            variant="outlined"
            onChange={(e) => this.onChange(e.target.value)}
          />
           </div>
        </form>
      </Box>
    );
  }

  private async onChange(value: string): Promise<void> {
    if (value) {
      const results = (this.miniSearch.search(
        value,
        this.searchOptions
      ) as unknown) as SearchedDefinition[];
      this.props.onSearch(this.MakeCategories(results));
    } else {
      this.props.onSearch(await this.props.categories);
    }
  }

  private MakeSearchable(
    categories: ShortcutCategories
  ): SearchableDefinition[] {
    return categories.categories.flatMap((category) =>
      category.definitions.map<SearchableDefinition>((definition) => {
        const metaTags = definition.metaTags
          ? definition.metaTags.reduce((str, tag) => str + tag + ' ', '')
          : '';
        return {
          id: definition.id,
          label: definition.label,
          metaTags,
          categoryLabel: category.label,
          category: category,
          definition: definition,
        };
      })
    );
  }

  private MakeCategories(
    searchables: SearchedDefinition[]
  ): ShortcutCategories {
    const indices: { [key: string]: number } = {};
    return searchables.reduce<ShortcutCategories>((categories, searchable) => {
      const catIdx = indices[searchable.category.id];
      if (catIdx !== undefined) {
        categories.categories[catIdx].definitions.push(searchable.definition);
      } else {
        const idx =
          categories.categories.push({
            ...searchable.category,
            definitions: [searchable.definition],
          }) - 1;
        indices[searchable.category.id] = idx;
      }
      return categories;
    }, new ShortcutCategories());
  }
}
